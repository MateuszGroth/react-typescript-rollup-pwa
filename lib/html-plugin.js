import * as ejs from 'ejs';
import { readFile } from './utils/helper';

// ! must be before serviceWorkerPlugin

const getJS = (bundle, filePath) => {
    const fileNameKey = filePath.split('/').pop().replace(/\W.+/g, '');

    const regexp = new RegExp(`${fileNameKey}([^/\.]+|)\.(t|j)sx?$`, 'i');
    const fileNameBundleKey = Object.keys(bundle).find(bundleKey => bundleKey.match(regexp));

    if (fileNameBundleKey == null) return null;

    return bundle[fileNameBundleKey];
};

export default function createHTMLPlugin() {
    // let fontNormal, fontBold;
    return {
        name: 'create-html-plugin',
        async buildStart() {
            this.emitFile({ type: 'asset', fileName: 'index.html' });
            // fontNormal = this.emitAsset('normal.woff2', readFile('src/asset/normal.woff2'));
            // fontBold = this.emitAsset('bold.woff2', readFile('src/asset/bold.woff2'));
        },
        async generateBundle(options, bundle) {
            const templateScr = options.format === 'es' ? 'src/template-modules.ejs' : 'src/template.ejs';
            const template = readFile(templateScr, { encoding: 'utf8' });

            const html = ejs.render(template, {
                mainJS: getJS(bundle, 'src/index.tsx').fileName,
                mainDeps: getJS(bundle, 'src/index.tsx').imports,
                // fonts: [
                //     { weight: 'normal', src: this.getAssetFileName(fontNormal) },
                //     { weight: 'bold', src: this.getAssetFileName(fontBold) },
                // ],
            });

            bundle['index.html'].fileName = 'index.html';
            bundle['index.html'].source = html;
            bundle['index.html'].type = 'asset';
        },
    };
}

// todo font include change
// <link rel="preload" as="font" crossorigin href="font.woff2">

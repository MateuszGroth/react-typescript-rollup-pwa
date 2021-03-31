import { posix } from 'path';
import { createHash } from 'crypto';

const importPrefix = 'service-worker:';
export default function serviceWorkerPlugin({ output = 'sw.js', filterAssets = () => true } = {}) {
    return {
        name: 'service-worker',
        async resolveId(id, importer) {
            if (!id.startsWith(importPrefix)) return;
            const plainId = id.slice(importPrefix.length);
            const result = await this.resolve(plainId, importer);

            if (!result) return;

            return importPrefix + result.id;
        },
        load(id) {
            if (!id.startsWith(importPrefix)) return;

            const fileId = this.emitFile({ type: 'chunk', fileName: output, id: id.slice(importPrefix.length) });
            return `export default import.meta.ROLLUP_FILE_URL_${fileId};`;
        },
        generateBundle(options, bundle) {
            const swChunk = bundle[output];
            const toCacheInSw = Object.values(bundle).filter(item => item !== swChunk && filterAssets(item));
            const urls = toCacheInSw.map(item => {
                return (
                    posix.relative(posix.dirname(output), item.fileName).replace(/((?<=^|\/)index)?\.html?$/g, '.') ||
                    '.'
                );
            });
            const versionHash = createHash('sha1');
            for (const item of toCacheInSw) {
                versionHash.update(item.code || item.source);
            }
            const version = versionHash.digest('hex');
            swChunk.code = `const ASSETS = ${JSON.stringify(urls)};\nconst VERSION = ${JSON.stringify(version)};\n${
                swChunk.code
            }`;
        },
    };
}

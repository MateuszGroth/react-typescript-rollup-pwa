import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
const rimraf = require('rimraf');

import webWorkerPlugin from './lib/web-worker-plugin';
import serviceWorkerPlugin from './lib/sw-plugin';
import createHTMLPlugin from './lib/html-plugin';
import constsPlugin from './lib/consts-plugin';

import { terser } from 'rollup-plugin-terser';

const shouldEnableDevServer = process.argv.length && process.argv.includes('development');
const outDir = shouldEnableDevServer ? 'dev' : 'public';
rimraf(`./${outDir}/js`, () => {
    console.log('js removed');
});
rimraf(`./${outDir}/index.html`, () => {
    console.log('index.html removed');
});
rimraf(`./${outDir}/css`, () => {
    console.log('css removed');
});

export default {
    input: ['src/index.tsx'],
    preserveEntrySignatures: false,
    output: {
        dir: outDir,
        // format: 'iife',
        format: 'es',
        entryFileNames: shouldEnableDevServer ? `js/[name].js` : `js/[name]-[hash].js`,
        chunkFileNames: shouldEnableDevServer ? `js/[name].js` : `js/[name]-[hash].js`,
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        alias({
            entries: [{ find: 'style', replacement: './style' }],
        }),
        postcss({
            // inject: false,
            minimize: !shouldEnableDevServer,
            extensions: ['.scss', '.css'],
            extract: 'css/main.css',
            config: {
                path: './postcss.config.js',
            },
        }),
        createHTMLPlugin(), // must be before serviceWorkerPlugin
        serviceWorkerPlugin({ output: 'js/sw.js' }),
        webWorkerPlugin(),
        constsPlugin({
            isDev: shouldEnableDevServer,
        }),
        typescript(),
        commonjs({
            sourceMap: !shouldEnableDevServer,
            namedExports: {
                'react': [
                    'createElement',
                    'Component',
                    'Suspense',
                    'useEffect',
                    'Fragment',
                    'useState',
                    'useRef',
                    'useReducer',
                    'useContext',
                    'useImperativeHandle',
                    'forwardRef',
                    'createContext',
                ],
            },
        }),
        nodeResolve({
            dedupe: ['react', 'react-dom'],
            extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
        }),
        ...(shouldEnableDevServer
            ? [
                  serve({ contentBase: [outDir], historyApiFallback: true }), // index.html should be in root of project
                  livereload({
                      watch: outDir,
                  }),
              ]
            : [terser()]),
    ],
};

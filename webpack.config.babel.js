const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

//  ! ADD THIS TO PACKAGE JSON when final version
//  ? Webpack hot reload does not work with that
//     "browserslist": [
//         "defaults",
//         "not IE 11",
//         "maintained node versions",
//         "not op_mini all"
//     ]

module.exports = (env = {}) => ({
    mode: 'development',
    ...(env.WEBPACK_SERVE ? {} : { target: ['web', 'es2017'] }), // webpack5 hot reload does not work when target is passed
    entry: {
        main: './src/index.tsx',
        'register-sw': './src/service-worker/register-sw.tsx', // if service worker not used - comment that part
        sw: './src/service-worker/sw.tsx' // if service worker not used - comment that part
    },
    output: {
        path: path.resolve(__dirname, './public'), // local dev is where the root is and has to be that
        filename: data => (data.chunk.name === 'sw' ? './js/[name].js' : './js/[name].[contenthash].js'), // we dont want to add contentHash to sw
        chunkFilename: './js/[name].[contenthash].chunk.js',
        // ! if production build fails, delete this publicPath and import css within main.scss instead of .js files
        publicPath: '' // adding it so .css import works within js files
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: '2'
                                }
                            ],
                            '@babel/preset-react'
                        ]
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        // After all CSS loaders we use plugin to do his work.
                        // It gets all transformed CSS and extracts it into separate
                        // single bundled file
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        // This loader resolves url() and @imports inside CSS
                        loader: 'css-loader'
                    },
                    {
                        // Then we apply postCSS fixes like autoprefixer and minifying
                        loader: 'postcss-loader'
                    },
                    {
                        // First we transform SASS to standard CSS
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|svg|gif|woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            ['style']: path.resolve(__dirname, 'style'),
            ['utils']: path.resolve(__dirname, 'src/utils'),
            ['global']: path.resolve(__dirname, 'src/components/global'),
            ['views']: path.resolve(__dirname, 'src/components/views'),
            ['user']: path.resolve(__dirname, 'src/components/user'),
            ['icons']: path.resolve(__dirname, 'src/components/icons'),
            ['nav']: path.resolve(__dirname, 'src/components/nav')
        }
    },
    optimization: {
        moduleIds: 'deterministic',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true
            })
        ],
        splitChunks: {
            cacheGroups: {
                //All node_modules into vendors.[hash].js
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: 'single'
    },
    plugins: [
        ...(env.WEBPACK_SERVE
            ? []
            : [
                  // deletes all the files within public folder except index.html on each build
                  new CleanWebpackPlugin({
                      cleanOnceBeforeBuildPatterns: ['**/*', '!index.html'],
                      cleanAfterEveryBuildPatterns: ['!index.html']
                  })
                  // if service workers are not passed as entries - use copyWebpackPlugin
                  //   new CopyWebpackPlugin({
                  //       patterns: [{ from: 'src/service-worker', to: 'js' }]
                  //   })
              ]),
        new HtmlWebpackPlugin({
            title: 'Caching',
            filename: 'index.html',
            template: `./src/template.ejs`,
            // if service workers are not passed as entries - uncomment
            // templateParameters: {
            //     prod: !env.WEBPACK_SERVE
            // },
            chunks: ['main', ...(!env.WEBPACK_SERVE ? ['register-sw'] : [])]
        }),
        new MiniCssExtractPlugin({
            filename: 'style/main.css'
        }),
        new ProgressBarPlugin()
    ],
    performance: {
        hints: false,
        maxEntrypointSize: 1512000,
        maxAssetSize: 1512000
    },
    devServer: {
        port: 9000,
        watchContentBase: true,
        liveReload: true,
        injectHot: true,
        open: true,
        hot: true,
        historyApiFallback: true
    }
});

import * as path from 'path';
import * as webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TypedCssModulesPlugin } from 'typed-css-modules-webpack-plugin';
import postCssPresetEnv from 'postcss-preset-env';
import cssNano from 'cssnano';

const rootDir = path.resolve(__dirname, '../..');
const srcDir = path.resolve(rootDir, 'src');
const distDir = path.resolve(rootDir, 'dist');

export default (webpackEnv: string): webpack.Configuration => {
    const isProd = webpackEnv === 'production';
    const isDev = webpackEnv === 'development';

    function getMode(): 'production' | 'development' | 'none' {
        if (isProd) {
            return 'production';
        }
        if (isDev) {
            return 'development';
        }
        return 'none';
    }

    return {
        mode: getMode(),
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
        },
        entry: {
            'content-script': path.resolve(srcDir, 'content-script/index.ts'),
        },
        output: {
            path: distDir,
            filename: '[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/i,
                    use: 'babel-loader',
                },
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localsConvention: 'camelCaseOnly',
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () =>
                                    [
                                        postCssPresetEnv(),
                                        isProd ? cssNano() : '',
                                    ].filter((v) => v !== ''),
                            },
                        },
                    ].filter((v) => v !== ''),
                },
            ],
        },
        plugins: [
            new TypedCssModulesPlugin({
                globPattern: 'src/**/*.css',
            }),
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.resolve(rootDir, 'tsconfig.json'),
                async: isDev,
                silent: true,
                useTypescriptIncrementalApi: true,
                eslint: true,
            }),
            new CopyWebpackPlugin([
                {
                    from:
                        'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
                },
                {
                    from: 'public/*',
                    flatten: true,
                },
            ]),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
        ],
        optimization: {
            minimizer: [new TerserPlugin()],
        },
    };
};

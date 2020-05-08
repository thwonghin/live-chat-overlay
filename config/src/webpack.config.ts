import * as path from 'path';
import * as webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TypedCssModulesPlugin } from 'typed-css-modules-webpack-plugin';
import postcssPresetEnv from 'postcss-preset-env';
import cssNano from 'cssnano';
import stylelint from 'stylelint';

const rootDir = path.resolve(__dirname, '../..');
const srcDir = path.resolve(rootDir, 'src');
const distDir = path.resolve(rootDir, 'dist');

type WebpackEnv = 'production' | 'development' | 'release' | 'storybook';

export default (webpackEnv: WebpackEnv): webpack.Configuration => {
    function getMode(): 'production' | 'development' | 'none' {
        switch (webpackEnv) {
            case 'development':
            case 'storybook':
                return 'development';
            case 'production':
            case 'release':
                return 'production';
            default:
                return 'none';
        }
    }

    const shouldSkipPreChecking = webpackEnv === 'release';
    const mode = getMode();

    const config: webpack.Configuration = {
        mode,
        stats: mode === 'production' ? 'errors-only' : 'normal',
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
                    test: /\.s[ac]ss$/i,
                    use: [
                        webpackEnv === 'storybook'
                            ? 'style-loader'
                            : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                        'sass-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: (): unknown[] => [
                                    ...(shouldSkipPreChecking
                                        ? []
                                        : [stylelint]),
                                    postcssPresetEnv(),
                                    ...(mode === 'production'
                                        ? [cssNano()]
                                        : []),
                                ],
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            ...(shouldSkipPreChecking
                ? []
                : [
                      new TypedCssModulesPlugin({
                          globPattern: 'src/**/*.scss',
                      }),
                      new ForkTsCheckerWebpackPlugin({
                          tsconfig: path.resolve(rootDir, 'tsconfig.json'),
                          async: false,
                          useTypescriptIncrementalApi: true,
                          eslint: true,
                      }),
                  ]),
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

    return config;
};

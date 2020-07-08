import * as path from 'path';
import * as webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TypedCssModulesPlugin } from 'typed-css-modules-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import postcssPresetEnv from 'postcss-preset-env';
import cssNano from 'cssnano';
import stylelint from 'stylelint';

const rootDir = path.resolve(__dirname, '../..');
const srcDir = path.resolve(rootDir, 'src');
const distDir = path.resolve(rootDir, 'dist');
const tsconfigPath = path.resolve(rootDir, 'tsconfig.json');

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
            plugins: [new TsconfigPathsPlugin({ configFile: tsconfigPath })],
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
        },
        entry: {
            'content-script': path.resolve(srcDir, 'content-script.ts'),
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
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                                plugins: (): unknown[] => [
                                    ...(shouldSkipPreChecking
                                        ? []
                                        : [stylelint]),
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
                          async: true,
                          typescript: {
                              enabled: true,
                              configFile: tsconfigPath,
                              mode: 'write-references',
                          },
                          eslint: {
                              enabled: true,
                              files: ['./src/**/*.ts', './src/**/*.tsx'],
                          },
                      }),
                  ]),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from:
                            'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
                    },
                    {
                        context: 'public',
                        from: '**/*',
                    },
                ],
            }),
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

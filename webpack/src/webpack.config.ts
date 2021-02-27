import * as path from 'path';
import * as webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { TypedCssModulesPlugin } from 'typed-css-modules-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import postcssPresetEnv from 'postcss-preset-env';
import cssNano from 'cssnano';
import stylelint from 'stylelint';

const rootDir = path.resolve(__dirname, '../..');
const srcDir = path.resolve(rootDir, 'src');
const distDir = path.resolve(rootDir, 'dist');

type WebpackEnv = 'production' | 'development' | 'release' | 'storybook';

const config = (
    webpackEnv: Partial<Record<WebpackEnv, boolean>>,
): webpack.Configuration => {
    function getMode(): 'production' | 'development' | 'none' {
        if (webpackEnv.development || webpackEnv.storybook) {
            return 'development';
        }

        if (webpackEnv.production || webpackEnv.release) {
            return 'production';
        }

        return 'none';
    }

    const shouldSkipPreChecking = webpackEnv === 'release';
    const mode = getMode();
    const tsconfigPath = path.resolve(
        rootDir,
        mode === 'development' ? 'tsconfig.dev.json' : 'tsconfig.json',
    );

    const config: webpack.Configuration = {
        mode,
        stats: mode === 'production' ? 'errors-only' : 'normal',
        resolve: {
            plugins: [
                new TsconfigPathsPlugin({ configFile: tsconfigPath }) as any,
            ],
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
                // TODO: remove this workaround for https://github.com/webpack/webpack/issues/11467
                {
                    test: /\.m?js/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/i,
                    use: 'babel-loader',
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        webpackEnv.storybook
                            ? 'style-loader'
                            : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
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
                        },
                        'sass-loader',
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
                          eslint: {
                              files: ['src/**/*.tsx', 'src/**/*.ts'],
                              enabled: true,
                          },
                          typescript: {
                              enabled: true,
                              configFile: tsconfigPath,
                              mode: 'write-references',
                          },
                      }),
                  ]),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        context: 'public',
                        from: '**/*',
                    },
                ],
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            // Webpack 5 removed node.js polyfills, but React still using it
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(mode),
                },
            }),
        ],
    };

    return config;
};

export default config;

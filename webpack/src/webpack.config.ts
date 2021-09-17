import * as path from 'path';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as webpack from 'webpack';

const rootDir = path.resolve(__dirname, '../..');
const srcDir = path.resolve(rootDir, 'src');
const distDir = path.resolve(rootDir, 'dist');

type WebpackEnv = 'production' | 'development' | 'storybook';

const config = (
    webpackEnv: Partial<Record<WebpackEnv, boolean>>,
): webpack.Configuration => {
    function getMode(): 'production' | 'development' | 'none' {
        if (webpackEnv.development || webpackEnv.storybook) {
            return 'development';
        }

        if (webpackEnv.production) {
            return 'production';
        }

        return 'none';
    }

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
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
                    use: 'swc-loader',
                },
            ],
        },
        plugins: [
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
            new CopyWebpackPlugin({
                patterns: [
                    {
                        context: 'public',
                        from: '**/*',
                    },
                ],
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

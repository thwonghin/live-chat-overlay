/* eslint-disable @typescript-eslint/naming-convention */
import * as path from 'path';

// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
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
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
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
        devtool: mode === 'development' ? 'inline-cheap-source-map' : false,
        stats: mode === 'production' ? 'errors-only' : 'normal',
        resolve: {
            plugins: [
                new TsconfigPathsPlugin({ configFile: tsconfigPath }) as any,
            ],
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
        entry: {
            'content-script': path.resolve(srcDir, 'content-script.ts'),
            'get-live-chat-init-data': path.resolve(
                srcDir,
                'get-live-chat-init-data.ts',
            ),
            'live-chat-fetch-interceptor': path.resolve(
                srcDir,
                'live-chat-fetch-interceptor.ts',
            ),
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
                typescript: {
                    configFile: tsconfigPath,
                    mode: 'readonly',
                },
            }),
            new CopyPlugin({
                patterns: [
                    {
                        context: 'public',
                        from: '**/*',
                    },
                ],
            }) as any,
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

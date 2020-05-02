import * as path from 'path';
import * as webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

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
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
                    test: /\.(js|jsx|ts|tsx)$/,
                    loader: 'babel-loader',
                },
            ],
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.resolve(rootDir, 'tsconfig.json'),
                async: isDev,
                silent: true,
                useTypescriptIncrementalApi: true,
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
        ],
        optimization: {
            minimizer: [new TerserPlugin()],
        },
    };
};

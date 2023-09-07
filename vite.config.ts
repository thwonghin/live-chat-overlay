import { defineConfig } from 'vite';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';

type Manifest = {
    version: string;
    web_accessible_resources?: Array<{
        resources?: string[];
    }>;
};

function readManifest(): Manifest {
    return readJsonFile('src/manifest.json');
}

function generateManifest() {
    const manifest = readManifest();
    const pkg = readJsonFile('package.json');
    manifest.version = pkg.version;
    if (manifest.web_accessible_resources) {
        manifest.web_accessible_resources =
            manifest.web_accessible_resources.map(({ resources, ...rest }) => {
                return {
                    ...rest,
                    resources: [
                        'style.css',
                        ...resources.map((filePath) => {
                            if (filePath.endsWith('.ts')) {
                                return `${filePath.slice(0, -2)}js`;
                            }
                            return filePath;
                        }),
                    ],
                };
            });
    }

    return manifest;
}

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        react(),
        webExtension({
            disableAutoLaunch: true,
            manifest: generateManifest,
            additionalInputs:
                readManifest().web_accessible_resources?.flatMap(
                    ({ resources }) => resources ?? [],
                ) ?? [],
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import "./src/_variable.scss"
                `,
            },
        },
    },
    resolve: {
        alias: {
            // In dev mode, make sure fast refresh works
            '/@react-refresh': path.resolve(
                'node_modules/@vitejs/plugin-react-swc/refresh-runtime.js',
            ),
        },
    },
});

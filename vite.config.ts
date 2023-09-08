import { defineConfig } from 'vite';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import solidPlugin from 'vite-plugin-solid';
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
        solidPlugin(),
        webExtension({
            disableAutoLaunch: true,
            manifest: generateManifest,
            additionalInputs:
                readManifest().web_accessible_resources?.flatMap(
                    ({ resources }) => resources ?? [],
                ) ?? [],
        }),
    ],
});

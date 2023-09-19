import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/html-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    viteFinal: (config) => {
        // we don't need to build the script for storybook
        config.plugins = config.plugins?.filter(
            (plugin) => (plugin as any).name !== 'web-extension:manifest',
        );
        return config;
    },
};

export default config;

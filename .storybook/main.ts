import type { StorybookConfig } from '@storybook/react-webpack5';
import configFunc from '../webpack/dist/webpack.config';

const custom = configFunc({ storybook: true });

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        'storybook-addon-swc',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    webpackFinal: (config) => ({
        ...config,
        resolve: {
            ...config.resolve,
            plugins: custom.resolve?.plugins,
            extensions: [
                ...(config?.resolve?.extensions ?? []),
                ...(custom.resolve?.extensions ?? []),
            ],
        },
    }),
};

export default config;

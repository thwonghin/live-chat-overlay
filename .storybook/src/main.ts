import configFunc from '../../webpack/dist/webpack.config';

const custom = configFunc({ storybook: true });

export default {
    core: {
        builder: 'webpack5',
    },
    stories: ['../../src/**/*.stories.tsx'],
    webpackFinal: (config: any) => ({
        ...config,
        resolve: {
            plugins: custom.resolve?.plugins,
            extensions: [
                ...(config?.resolve?.extensions ?? []),
                ...(custom.resolve?.extensions ?? []),
            ],
        },
    }),
};

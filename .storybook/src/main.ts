import configFunc from '../../webpack/dist/webpack.config';

const custom = configFunc('storybook');

export default {
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
        module: {
            ...config.module,
            rules: custom.module?.rules ?? [],
        },
    }),
};

import configFunc from '../../config/dist/webpack.config';

const custom = configFunc('storybook');

export default {
    stories: ['../../src/**/*.stories.tsx'],
    webpackFinal: (config: any) => ({
        ...config,
        resolve: {
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

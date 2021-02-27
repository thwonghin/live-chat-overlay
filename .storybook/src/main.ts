import configFunc from '../../webpack/dist/webpack.config';

const custom = configFunc({ storybook: true });

export default {
    core: {
        builder: "webpack5",
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
        module: {
            ...config.module,
            rules: custom.module?.rules
                // TODO: remove this workaround for https://github.com/webpack/webpack/issues/11467
                ?.filter((rule) => rule === '...' || rule.resolve?.fullySpecified !== false)
                ?? [],
        },
    }),
};

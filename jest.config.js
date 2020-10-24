module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^lodash-es$': 'lodash', // workaround for es module
    },
    globals: {
        'ts-jest': {
            isolatedModules: true,
            tsconfig: 'tests/tsconfig.json',
        },
    },
};

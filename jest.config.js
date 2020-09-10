module.exports = {
    preset: '@swc-node/jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^lodash-es$': 'lodash', // workaround for es module
    },
};

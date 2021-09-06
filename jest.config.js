module.exports = {
    transform: {
        "^.+\\.(t|j)sx?$": ["@swc/jest"],
    },
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^.+\\.(css|scss)$': '<rootDir>/tests/mocks/style-mock.ts',
        '^lodash-es$': require.resolve('lodash'), // Workaround for es module
    },
};

const fs = require('fs');
const path = require('path');

const swcConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.swcrc'), 'utf-8'));

module.exports = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^lodash-es$': require.resolve('lodash'), // Workaround for es module
    },
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest', {
            ...swcConfig,
            "module": {
                "type": "commonjs"
            },
        }],
    },
};

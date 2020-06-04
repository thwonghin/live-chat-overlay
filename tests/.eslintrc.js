module.exports = {
    extends: [
        '../.eslintrc.js',
        'plugin:jest/recommended',
        'plugin:jest/style',
    ],
    plugins: ['jest'],
    env: {
        'jest/globals': true,
    },
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
};

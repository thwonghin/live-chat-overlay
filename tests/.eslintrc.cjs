module.exports = {
    extends: [
        '../.eslintrc.cjs',
        'plugin:jest/recommended',
        'plugin:jest/style',
    ],
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
};

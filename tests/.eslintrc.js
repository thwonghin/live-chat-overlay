module.exports = {
    extends: [
        '../.eslintrc.js',
        'plugin:jest/recommended', 
        'plugin:jest/style',
    ],
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    }
};

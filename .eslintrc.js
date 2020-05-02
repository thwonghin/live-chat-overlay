module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
        'prettier/react',
    ],
    plugins: ['@typescript-eslint'],
    rules: {
        'import/prefer-default-export': 'off',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
    },
};

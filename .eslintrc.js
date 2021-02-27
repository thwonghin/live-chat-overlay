module.exports = {
    extends: [
        'xo',
        'xo/browser',
        'xo/esnext',
        'xo-typescript',
        'xo-react',
        "plugin:prettier/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname
    },
    rules: {
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": 'off',
        "unicorn/no-array-callback-reference": "off",
        "react-hooks/exhaustive-deps": "error",
        "node/file-extension-in-import": "off"
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
            },
        },
    },
};

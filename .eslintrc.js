module.exports = {
    extends: [
        'xo',
        'xo/browser',
        'xo-typescript',
        'xo-react/space',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
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
        "node/file-extension-in-import": "off",
        "import/order": [
            "error",
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    ["parent", "sibling"]
                ],
                pathGroups: [{
                    pattern: 'react',
                    group: 'external',
                    position: 'before',
                }, {
                    pattern: '@/**',
                    group: 'internal',
                    position: 'before',
                }],
                pathGroupsExcludedImportTypes: [
                    'react',
                    '@/**',
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                }
            }
        ]
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
            },
            typescript: {
                alwaysTryTypes: true
            }
        },
    },
};

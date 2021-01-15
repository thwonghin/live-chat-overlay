module.exports = {
    space: true,
    prettier: true,
    extends: [
        'xo-react'
    ],
    rules: {
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/prop-types": 'off',
        "unicorn/no-array-callback-reference": "off",
        "react-hooks/exhaustive-deps": "error"
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    overrides: [
        {
            "files": "tests/**/*.ts",
            extends: [
                'plugin:jest/recommended', 
                'plugin:jest/style',
            ]
        },
    ]
};

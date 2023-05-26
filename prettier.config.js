module.exports = {
    arrowParens: 'always',
    semi: true,
    singleQuote: true,
    jsxSingleQuote: false,
    printWidth: 100,
    useTabs: false,
    tabWidth: 4,
    trailingComma: 'es5',
    plugins: [require('prettier-plugin-tailwindcss'), require.resolve('prettier-plugin-astro')],
    tailwindConfig: './tailwind.config.js',
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
};

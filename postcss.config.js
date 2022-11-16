console.log('using postcss config');
module.exports = {
    purge: ['./{src}/**/*.{ts,tsx}'],
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};

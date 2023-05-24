/** @type {import('tailwindcss').Config} */
console.log('using tailwindcss config');
module.exports = {
    content: ['./{src,demo,gallery,notebook}/**/*.{ts,tsx,astro}'],
    theme: {
        extend: {},
    },
    mode: 'jit',
};

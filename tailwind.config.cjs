/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{astro,html,js,jsx,ts,tsx,svelte}',
    ],
    theme: {
      extend: {
        maxWidth: {
          // Optimal content width: 720px (45rem) for readability
          content: '720px',
        },
      },
    },
    safelist: [
      'max-w-content',
      'glass',
      'header-glass',
    ],
  }
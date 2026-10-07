/** @type {import('tailwindcss').Config} */
const withAlpha = (varName, fallback) => `rgb(var(${varName}, ${fallback}) / <alpha-value>)`;

export default {
  content: [
    './src/**/*.{html,js,svelte,ts,jsx,tsx}',
    './packages/**/*.{html,js,svelte,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: withAlpha('--color-primary-50', '239 246 255'),
          100: withAlpha('--color-primary-100', '219 234 254'),
          200: withAlpha('--color-primary-200', '191 219 254'),
          300: withAlpha('--color-primary-300', '147 197 253'),
          400: withAlpha('--color-primary-400', '96 165 250'),
          500: withAlpha('--color-primary-500', '59 130 246'),
          600: withAlpha('--color-primary-600', '37 99 235'),
          700: withAlpha('--color-primary-700', '29 78 216'),
          800: withAlpha('--color-primary-800', '30 64 175'),
          900: withAlpha('--color-primary-900', '30 58 138')
        },
        surface: withAlpha('--color-surface', '249 250 251')
      },
      maxWidth: {
        page: 'var(--width-page, 80rem)'
      },
      borderRadius: {
        sm: 'var(--radius-sm, 0.25rem)',
        DEFAULT: 'var(--radius-md, 0.375rem)',
        md: 'var(--radius-md, 0.375rem)',
        lg: 'var(--radius-lg, 0.5rem)'
      },
      spacing: {
        'page-x': 'var(--space-page-x, 1rem)',
        'page-y': 'var(--space-page-y, 2rem)',
        'page-y-md': 'var(--space-page-y-md, 3rem)'
      },
      boxShadow: {
        sm: 'var(--shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05))',
        DEFAULT: 'var(--shadow-md, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1))',
        md: 'var(--shadow-md, 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1))',
        lg: 'var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1))'
      }
    }
  },
  plugins: []
};

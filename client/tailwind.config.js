/** @type {import('tailwindcss').Config} */
export default {
  // Completely disable purging to ensure all CSS is included
  content: false,
  // Alternative approach if the above is too extreme:
  // content: [
  //   './index.html',
  //   './src/**/*.{js,ts,jsx,tsx}',
  //   './public/**/*.html',
  //   './src/**/*.{css,scss}',
  // ],
  safelist: [
    // Include ALL Tailwind classes here that you need
    // This is a fallback in case you re-enable content purging
    'active',
    // Animation classes
    'animate-scale-in', 'animate-fade-out', 'animate-letter-spacing', 'animate-loading-bounce',
    // Brand colors
    'bg-brand-primary', 'bg-brand-secondary', 'bg-brand-light',
    'text-brand-primary', 'text-brand-secondary', 'text-brand-light',
    // Common utility classes
    'flex', 'items-center', 'justify-center', 'justify-between',
    'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10',
    'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10',
    'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8', 'px-10',
    'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-8', 'py-10',
    'rounded', 'rounded-md', 'rounded-lg', 'rounded-full',
    'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl',
    'font-normal', 'font-medium', 'font-semibold', 'font-bold'
  ],
  theme: {
    extend: {
      animation: {
        'scale-in': 'scaleIn 4s ease-in-out forwards',
        'fade-out': 'fadeOut 4s ease-in-out forwards',
        'letter-spacing': 'letterSpacing 4s ease-in-out forwards',
        'loading-bounce': 'loadingBounce 4s ease-in-out infinite',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(1)', opacity: '0' },
          '30%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        letterSpacing: {
          '0%': { letterSpacing: '0em' },
          '30%': { letterSpacing: '0.15em' },
          '100%': { letterSpacing: '0.1em' }
        },
        loadingBounce: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(200%)' }
        }
      },
      colors: {
        'brand-primary': '#E0B0FF',
        'brand-secondary': '#C8A2C8',
        'brand-light': '#1a1a1a'
      }
    },
  },
  plugins: [],
}
import { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';
import {
  addWidth,
  pxrSpacingPositive,
  pxrSpacingWithNegative,
} from './src/shared/config/tailwind/tailwind-utils';
import { SCREEN_SIZES } from './src/shared/config/tailwind/screen';



const scrollbarGutterPlugin = plugin(({ addUtilities }) => {
  addUtilities({
    '.scrollbar-gutter-stable': {
      'scrollbar-gutter': 'stable',
    },
    '.scrollbar-gutter-stable-both': {
      'scrollbar-gutter': 'stable both-edges',
    },
  });
});

const config = {
  darkMode: ['class', '[data-mode="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      screens: SCREEN_SIZES,
      spacing: pxrSpacingWithNegative(-100, 100),
      width: addWidth(pxrSpacingPositive(1600)),
      height: pxrSpacingPositive(1600),
      margin: pxrSpacingWithNegative(-200, 200),
      padding: pxrSpacingWithNegative(-200, 220),
      inset: pxrSpacingPositive(100),
      borderWidth: pxrSpacingPositive(10),
      borderRadius: pxrSpacingPositive(100),
      maxHeight: pxrSpacingPositive(999),
      maxWidth: addWidth(pxrSpacingPositive(999)),
      minHeight: pxrSpacingPositive(999),
      minWidth: addWidth(pxrSpacingPositive(999)),
      fontSize: pxrSpacingPositive(200),
    },
    boxShadow: {
      card: '0px 0px 6px #8D868160',
    },
    keyframes: {
      shimmer: {
        '0%': {
          transform: 'translateX(-100%)',
        },
        '100%': {
          transform: 'translateX(100%)',
        },
      },
      fade: {
        '0%': { opacity: '0.2' },
        '50%': { opacity: '1' },
        '100%': { opacity: '0.2' },
      },
      spin: {
        from: {
          transform: 'rotate(0deg)',
        },
        to: {
          transform: 'rotate(360deg)',
        },
      },
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
    animation: {
      shimmer: 'shimmer 1.4s infinite ease',
      fade: 'fade 1.4s infinite ease',
      spin: 'spin 1s linear infinite',
      'accordion-down': 'accordion-down 0.3s ease-out',
      'accordion-up': 'accordion-up 0.3s ease-out',
    },
  },
  plugins: [tailwindcssAnimate,  scrollbarGutterPlugin],
} satisfies Config;

export default config;

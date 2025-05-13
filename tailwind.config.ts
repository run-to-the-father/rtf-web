import { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { SCREEN_SIZES } from './src/shared/config/tailwind/screen';
import {
  addWidth,
  pxrSpacingPositive,
  pxrSpacingWithNegative,
} from './src/shared/config/tailwind/tailwind-utils';
import { TYPOGRAPHY } from './src/shared/config/tailwind/typography';

const tailwindPlugin = plugin(({ addUtilities }) => {
  addUtilities(TYPOGRAPHY, {
    respectPrefix: true,
    respectImportant: true,
  });
});

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
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#E9E9E9',
          foreground: '#000000',
        },
        stone: {
          '50': '#F7F8F9', // 매우 밝은 회색
          '100': '#00000008',
        },
      },
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
      'caret-blink': {
        '0%,70%,100%': { opacity: '1' },
        '20%,50%': { opacity: '0' },
      },
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
      'slide-in-left': {
        '0%': { transform: 'translateX(-100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
      'slide-out-left': {
        '0%': { transform: 'translateX(0)', opacity: '1' },
        '100%': { transform: 'translateX(-100%)', opacity: '0' },
      },
    },
    animation: {
      shimmer: 'shimmer 1.4s infinite ease',
      fade: 'fade 1.4s infinite ease',
      spin: 'spin 1s linear infinite',
      'accordion-down': 'accordion-down 0.3s ease-out',
      'accordion-up': 'accordion-up 0.3s ease-out',
      'slide-in-left': 'slide-in-left 0.3s ease-out forwards',
      'caret-blink': 'caret-blink 1.25s ease-out infinite',
      'slide-out-left': 'slide-out-left 0.3s ease-in forwards',
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    scrollbarGutterPlugin,
    tailwindPlugin,
  ],
} satisfies Config;

export default config;

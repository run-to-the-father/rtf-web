const prettierConfig = require('eslint-config-prettier');
const onlyWarn = require('eslint-plugin-only-warn');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const turboPlugin = require('eslint-plugin-turbo');
const globals = require('globals');
const js = require('@eslint/js');
const nextPlugin = require('@next/eslint-plugin-next');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

// 📦 Base Configuration (JS/TS/Prettier/Turbo)
const baseConfig = [
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-empty-interface': 'off',
    },
  },
  {
    plugins: { turbo: turboPlugin },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    plugins: { onlyWarn },
  },
  {
    ignores: ['dist/**'],
  },
];

// ⚛️ Next.js + React Specific Configuration
const nextConfig = [
  ...baseConfig,
  {
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: { 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
];

// 🚀 Final Export (CommonJS)
module.exports = nextConfig;

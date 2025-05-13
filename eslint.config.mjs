// eslint.config.mjs
import prettierConfig from 'eslint-config-prettier';
import onlyWarn from 'eslint-plugin-only-warn';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import turboPlugin from 'eslint-plugin-turbo';
import * as globals from 'globals/index.js';
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

// 1) 기본 베이스 설정
const baseConfig = [
  // JS 기본 룰
  js.configs.recommended,

  // Prettier와 충돌 없게
  prettierConfig,

  // TS 플러그인 및 파서 설정
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

  // turbo 플러그인
  {
    plugins: { turbo: turboPlugin },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },

  // 모든 룰을 경고만 내도록
  {
    plugins: { onlyWarn },
  },

  // 빌드 결과물 무시
  {
    ignores: ['dist/**'],
  },
];

// 2) Next.js 전용 설정
const nextConfig = [
  ...baseConfig,

  // React 기본 추천 룰
  {
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },

  // Next.js ESLint 플러그인
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // React Hooks 룰
  {
    plugins: { 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
];

// 3) 최종 export
export default nextConfig;

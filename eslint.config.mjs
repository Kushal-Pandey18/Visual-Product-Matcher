// eslint.config.mjs
import next from 'eslint-config-next';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsparser,
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // CRITICAL FIX 1: Downgrade 'no-explicit-any' to a warning
      '@typescript-eslint/no-explicit-any': 'warn',

      // CRITICAL FIX 2: Allow standard HTML <img> tag
      '@next/next/no-img-element': 'off',

      // Standard warnings
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
    },
  },
  ...next,
];

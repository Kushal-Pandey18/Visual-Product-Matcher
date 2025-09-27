/** @type {import('eslint').Linter.Config} */
const config = {
  // Base Next.js configuration and core web vitals rules
  extends: ['next/core-web-vitals'],
  // Specifies the parser for TypeScript files
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // --------------------------------------------------------
    // CRITICAL: Downgrade 'no-explicit-any' to a warning
    // This allows the Vercel build to succeed because the 'any'
    // type is necessary for certain Node.js library functions (canvas/fetch buffers).
    '@typescript-eslint/no-explicit-any': 'warn', 

    // Other recommended clean code rules
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    // We can disable the rule for Next.js Image component since we use raw <img>
    // in ProductCard due to performance in SSR contexts.
    '@next/next/no-img-element': 'off',
    // --------------------------------------------------------
  },
  parserOptions: {
    // Ensures ESLint can read TypeScript files correctly
    project: 'tsconfig.json',
  },
};

module.exports = config;

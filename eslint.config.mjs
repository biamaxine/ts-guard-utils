import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';

export default defineConfig([
  tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, prettier },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: { 'prettier/prettier': 'error' },
  },
]);

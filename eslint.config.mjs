// import { dirname } from 'path';
// import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
//
// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

const eslintConfig = [
  {
    ignores: [
      '**/node_modules/*',
      '**/out/*',
      '**/.next/*',
      '**/public/*',
      '*.json',
      '*.md',
      '*.svg',
    ],
  },
  {
    name: 'eslint/recommended',
    rules: js.configs.recommended.rules,
  },
  ...tseslint.configs.recommended,
  {
    name: 'react/jsx-runtime',
    plugins: {
      react: reactPlugin,
    },
    rules: reactPlugin.configs['jsx-runtime'].rules,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    name: 'react-hooks/recommended',
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: hooksPlugin.configs.recommended.rules,
  },
  {
    name: 'next/core-web-vitals',
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    name: 'prettier/config',
    ...eslintConfigPrettier,
  },
  {
    name: 'project-custom',
    rules: {
      // Possible errors
      'no-console': 'warn',
      // Best practices
      'dot-notation': 'error',
      'no-else-return': 'error',
      'no-floating-decimal': 'error',
      'no-sequences': 'error',
      // Stylistic
      'array-bracket-spacing': 'error',
      'computed-property-spacing': ['error', 'never'],
      curly: 'error',
      'no-lonely-if': 'error',
      'no-unneeded-ternary': 'error',
      'one-var-declaration-per-line': 'error',
      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: false,
          avoidEscape: true,
        },
      ],
      // ES6
      'array-callback-return': 'off',
      'prefer-const': 'error',
      // Imports
      'import/prefer-default-export': 'off',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      'no-unused-expressions': 'off',
      'no-prototype-builtins': 'off',
      // REACT
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/href-no-hash': [0],
      'react/display-name': 0,
      'react/no-deprecated': 'error',
      'react/no-unsafe': [
        'error',
        {
          checkAliases: true,
        },
      ],
      'react/jsx-sort-props': [
        'error',
        {
          ignoreCase: true,
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 1,
      'no-void': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];

export default eslintConfig;

// **/.git
// **/.svn
// **/.hg
// **/node_modules
// **/.next
// *.yaml
// *.json
// *.md
// *.svg

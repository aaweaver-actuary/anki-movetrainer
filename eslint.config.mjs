import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Ignore build artifacts
  {
    ignores: ['dist/**', 'lib/**', 'node_modules/**'],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // Provide browser globals (window, document, setTimeout, etc.)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // TypeScript support
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // Let Prettier handle formatting; turn off conflicting rules
  prettier,
];

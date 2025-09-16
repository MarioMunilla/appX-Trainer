import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin'
import svelte from 'eslint-plugin-svelte'
import { includeIgnoreFile } from '@eslint/compat'
import { fileURLToPath } from 'node:url'
import ts from 'typescript-eslint'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))

export default [
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  stylistic.configs.recommended,
  stylistic.configs.customize({
    indent: 'tab',
    quotes: 'single',
    semi: false,
    commaDangle: 'never',
    braceStyle: '1tbs'
  }),
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    },
    rules: {
      'svelte/valid-compile': ['error', { ignoreWarnings: true }],
      'svelte/no-at-html-tags': 'off',
      'svelte/no-navigation-without-resolve': ['off'],
      'a11y-click-events-have-key-events': 'off'
    }
  },
  {
    files: ['**/*.svelte', '**/*.ts'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@stylistic/max-statements-per-line': ['error', { max: 3 }]
    }
  },
  {
    // 🔥 Bloque global para asegurar estilo uniforme
    files: ['**/*.{js,ts,svelte}'],
    rules: {
      '@stylistic/indent': 'off',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/brace-style': ['error', '1tbs']
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  }
]

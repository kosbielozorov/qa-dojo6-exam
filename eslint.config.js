import js from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-plugin-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '*.min.js',
      'test-results/',
      'playwright-report/',
      'playwright/.cache/',
      'coverage/',
      '*.d.ts',
      'lighthouse/',
      '.auth/',
      'uploads/',
      'package-lock.json',
    ],
  },

  // Base JavaScript configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2025,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...configPrettier.rules,
      'prettier/prettier': 'error',
      'no-console': 'error',
      'no-undef': 'error',
      'no-unused-vars': 'error',
      'no-var': 'error',
    },
  },

  // TypeScript configuration
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-unused-expressions': 'error',
    },
  })),

  // SonarJS configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      sonarjs,
    },
    rules: {
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-dead-store': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/unused-import': 'error',
      'sonarjs/no-unused-function-argument': 'error',
    },
  },

  // Playwright test files configuration
  {
    files: [
      'tests/**/*.{js,ts}',
      '**/*.spec.{js,ts}',
      '**/*.test.{js,ts}',
      'framework/**/*.{js,ts}',
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2025,
      },
    },
    plugins: {
      playwright,
    },
    rules: {
      // Рекомендовані правила Playwright
      'playwright/expect-expect': 'off', // Відключаємо для складних тестів
      'playwright/max-nested-describe': 'warn',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-conditional-expect': 'warn',
      'playwright/no-conditional-in-test': 'off', // Відключаємо для framework файлів
      'playwright/no-element-handle': 'warn',
      'playwright/no-eval': 'warn',
      'playwright/no-focused-test': 'error',
      'playwright/no-force-option': 'warn',
      'playwright/no-nested-step': 'warn',
      'playwright/no-networkidle': 'error',
      'playwright/no-page-pause': 'warn',
      'playwright/no-skipped-test': 'warn',
      'playwright/no-standalone-expect': 'error',
      'playwright/no-unsafe-references': 'error',
      'playwright/no-useless-await': 'warn',
      'playwright/no-useless-not': 'warn',
      'playwright/no-wait-for-selector': 'warn',
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/valid-describe-callback': 'error',
      'playwright/valid-expect': 'error',
      'playwright/valid-expect-in-promise': 'error',
      'playwright/valid-title': 'error',
    },
  },

  // Playwright test files (тільки тести) - більш строгі правила
  {
    files: ['tests/**/*.{js,ts}', '**/*.spec.{js,ts}', '**/*.test.{js,ts}'],
    plugins: {
      playwright,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2025,
      },
    },
    rules: {
      'playwright/no-conditional-in-test': 'warn', // Включаємо для тестів
      'playwright/no-skipped-test': 'warn',
    },
  },
];

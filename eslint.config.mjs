// @ts-check
/**
 * Single source of truth for static analysis.
 * Later blocks override earlier ones; prettier must stay last.
 */
import eslint from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import vitest from '@vitest/eslint-plugin';
import angular from 'angular-eslint';
import boundaries from 'eslint-plugin-boundaries';
import checkFile from 'eslint-plugin-check-file';
import noSecrets from 'eslint-plugin-no-secrets';
import perfectionist from 'eslint-plugin-perfectionist';
import rxjs from 'eslint-plugin-rxjs-x';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';

/** Feature layer globs, shared by the layer-specific blocks below. */
const DOMAIN = 'src/app/features/*/domain/**/*.ts';
const APPLICATION = 'src/app/features/*/application/**/*.ts';
const INFRASTRUCTURE = 'src/app/features/*/infrastructure/**/*.ts';
const UI = 'src/app/features/*/ui/**/*.ts';

/** Browser APIs that must not leak outside the infrastructure layer. */
const BROWSER_GLOBALS = [
  'window',
  'document',
  'localStorage',
  'sessionStorage',
  'fetch',
  'XMLHttpRequest',
  'navigator',
  'location',
  'history',
  'alert',
  'confirm',
  'prompt',
];

export default tseslint.config(
  {
    name: 'project/ignores',
    ignores: [
      'dist/**',
      '.angular/**',
      'coverage/**',
      'reports/**',
      '.stryker-tmp/**',
      'node_modules/**',
      'public/**',
      // Vendored design system, not our code.
      'Nocturne/**',
    ],
  },

  {
    name: 'project/ts',
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      comments.recommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs', '*.cjs', '*.js'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      perfectionist,
      sonarjs,
      unicorn,
      'check-file': checkFile,
      'no-secrets': noSecrets,
    },
    rules: {
      // Types and safety.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase'] },
        // No hungarian notation: UserRepository, not IUserRepository.
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        { selector: 'typeProperty', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'enumMember', format: ['PascalCase'] },
        { selector: 'objectLiteralProperty', format: null },
        {
          selector: 'classProperty',
          modifiers: ['static', 'readonly'],
          format: ['UPPER_CASE', 'camelCase'],
        },
      ],

      // Complexity budgets.
      complexity: ['error', 8],
      'max-depth': ['error', 3],
      'max-params': ['error', 4],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
      'max-nested-callbacks': ['error', 3],
      'sonarjs/cognitive-complexity': ['error', 12],
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-duplicated-branches': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/prefer-immediate-return': 'error',
      'sonarjs/no-nested-template-literals': 'error',

      // General hygiene.
      'no-console': 'error',
      'no-alert': 'error',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-param-reassign': ['error', { props: true }],
      'prefer-const': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-return-await': 'off',
      'object-shorthand': ['error', 'always'],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use a union type or an `as const` object instead of enum (erasableSyntaxOnly).',
        },
        {
          selector:
            'ClassDeclaration[abstract=true] > ClassBody > MethodDefinition[kind="constructor"]',
          message: 'Avoid constructors in abstract classes; prefer factories or inject().',
        },
      ],

      'no-secrets/no-secrets': ['error', { tolerance: 4.2 }],

      // Every disable must explain itself.
      '@eslint-community/eslint-comments/require-description': [
        'error',
        { ignore: ['eslint-enable'] },
      ],
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      '@eslint-community/eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],

      // Deterministic ordering (auto-fixable). Import groups follow layer direction.
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          newlinesBetween: 1,
          groups: [
            'angular',
            'rxjs',
            ['builtin', 'external'],
            'domain',
            'application',
            'infrastructure',
            'ui',
            ['parent', 'sibling', 'index'],
            'style',
            'unknown',
          ],
          customGroups: [
            { groupName: 'angular', elementNamePattern: '^@angular/.*' },
            { groupName: 'rxjs', elementNamePattern: ['^rxjs$', '^rxjs/.*'] },
            { groupName: 'domain', elementNamePattern: '.*/domain/.*' },
            { groupName: 'application', elementNamePattern: '.*/application/.*' },
            { groupName: 'infrastructure', elementNamePattern: '.*/infrastructure/.*' },
            { groupName: 'ui', elementNamePattern: '.*/ui/.*' },
          ],
        },
      ],
      'perfectionist/sort-named-imports': ['error', { type: 'natural' }],
      'perfectionist/sort-named-exports': ['error', { type: 'natural' }],
      'perfectionist/sort-exports': ['error', { type: 'natural' }],

      // Curated unicorn subset, not the recommended preset.
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/throw-new-error': 'error',
      'unicorn/error-message': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-date-now': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/consistent-function-scoping': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/no-instanceof-builtins': 'error',
      'unicorn/prefer-set-has': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/prefer-includes': 'error',

      // File and folder naming.
      'check-file/filename-naming-convention': [
        'error',
        { 'src/**/*.ts': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { 'src/app/**/': 'KEBAB_CASE' }],
      'check-file/no-index': 'error',
    },
  },

  {
    name: 'project/angular-ts',
    files: ['**/*.ts'],
    extends: [angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      // Angular 22 style guide drops class suffixes: `App`, not `AppComponent`.
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/directive-class-suffix': 'off',

      // Presentational components are legitimately empty classes with a decorator.
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],

      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/use-component-view-encapsulation': 'error',
      '@angular-eslint/use-injectable-provided-in': 'error',
      '@angular-eslint/no-attribute-decorator': 'error',
      '@angular-eslint/no-forward-ref': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/no-queries-metadata-property': 'error',
      '@angular-eslint/relative-url-prefix': 'error',
      '@angular-eslint/require-lifecycle-on-prototype': 'error',
      '@angular-eslint/sort-lifecycle-methods': 'error',
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
    },
  },
  {
    // RxJS rules need type information, so scope them to app code.
    name: 'project/rxjs',
    files: ['src/**/*.ts'],
    plugins: { 'rxjs-x': rxjs },
    rules: {
      'rxjs-x/no-ignored-subscription': 'error',
      'rxjs-x/no-nested-subscribe': 'error',
      'rxjs-x/no-unsafe-takeuntil': 'error',
      'rxjs-x/no-async-subscribe': 'error',
      'rxjs-x/no-ignored-error': 'error',
      'rxjs-x/no-subject-value': 'error',
      'rxjs-x/no-exposed-subjects': 'error',
      'rxjs-x/prefer-observer': 'error',
      'rxjs-x/throw-error': 'error',
      'rxjs-x/no-topromise': 'error',
    },
  },
  {
    name: 'project/angular-templates',
    files: ['**/*.html'],
    // index.html is the app document, not an Angular template.
    ignores: ['src/index.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // Off on purpose: `{{ mySignal() }}` is idiomatic in signal-first Angular.
      '@angular-eslint/template/no-call-expression': 'off',
      '@angular-eslint/template/cyclomatic-complexity': ['error', { maxComplexity: 6 }],
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-ngsrc': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/eqeqeq': ['error', { allowNullOrUndefined: false }],
      '@angular-eslint/template/button-has-type': 'error',
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/conditional-complexity': ['error', { maxComplexity: 4 }],
      '@angular-eslint/template/use-track-by-function': 'error',
    },
  },

  {
    name: 'project/architecture',
    files: ['src/**/*.ts'],
    plugins: { boundaries },
    settings: {
      // boundaries resolves paths with the node resolver, which needs .ts spelled out.
      'import/resolver': {
        node: { extensions: ['.ts', '.js', '.mjs', '.cjs', '.json'] },
      },
      // One file belongs to one layer: the first matching pattern wins.
      'boundaries/elements-single-match': true,
      // Elements describe folders, so order goes from specific to generic.
      'boundaries/elements': [
        { type: 'feature-domain', pattern: 'src/app/features/*/domain', capture: ['feature'] },
        {
          type: 'feature-application',
          pattern: 'src/app/features/*/application',
          capture: ['feature'],
        },
        {
          type: 'feature-infrastructure',
          pattern: 'src/app/features/*/infrastructure',
          capture: ['feature'],
        },
        { type: 'feature-ui', pattern: 'src/app/features/*/ui', capture: ['feature'] },
        // Feature root holds index.ts, the public API (see boundaries/files).
        { type: 'feature-root', pattern: 'src/app/features/*', capture: ['feature'] },
        { type: 'shared-kernel', pattern: 'src/app/shared/kernel' },
        // Test helpers (Result unwrapping etc.) — dependency-free, importable from any spec.
        { type: 'shared-testing', pattern: 'src/app/shared/testing' },
        { type: 'shared', pattern: 'src/app/shared' },
        { type: 'core', pattern: 'src/app/core' },
        { type: 'app-shell', pattern: 'src/app' },
        { type: 'bootstrap', pattern: 'src' },
      ],
      'boundaries/files': [
        // The only legal door into a feature.
        { category: 'feature-entry', pattern: 'src/app/features/*/index.ts' },
        { category: 'test', pattern: '**/*.spec.ts' },
      ],
    },
    rules: {
      // Every file under src/ must belong to a layer, so no folder escapes the architecture.
      'boundaries/no-unknown-files': 'error',
      'boundaries/no-unknown-dependencies': 'error',

      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // External packages are allowed everywhere except domain. `allow` overrides
            // `disallow` in this plugin, so the domain ban is expressed as a missing
            // permission (default disallow) rather than a disallow policy.
            // Per-package bans for other layers live in no-restricted-imports below.
            {
              from: { element: { type: '!feature-domain' } },
              allow: { to: { module: { origin: ['external', 'core'] } } },
            },

            // domain -> own domain + shared/kernel only.
            {
              from: { element: { type: 'feature-domain' } },
              allow: {
                to: {
                  element: {
                    type: 'feature-domain',
                    captured: { feature: '{{ from.captured.feature }}' },
                  },
                },
              },
            },
            {
              from: { element: { type: 'feature-domain' } },
              allow: { to: { element: { type: 'shared-kernel' } } },
            },
            {
              // Specs in domain may use test helpers; shared/testing has no logic of its own.
              from: { element: { type: 'feature-domain' } },
              allow: { to: { element: { type: 'shared-testing' } } },
            },
            {
              from: { element: { type: 'shared-kernel' } },
              allow: { to: { element: { type: 'shared-testing' } } },
            },
            {
              from: { element: { type: 'feature-infrastructure' } },
              allow: { to: { element: { type: 'shared-testing' } } },
            },

            // application -> own domain/application + shared.
            {
              from: { element: { type: 'feature-application' } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ['feature-domain', 'feature-application'] },
                    captured: { feature: '{{ from.captured.feature }}' },
                  },
                },
              },
            },
            {
              from: { element: { type: 'feature-application' } },
              allow: { to: { element: { types: { anyOf: ['shared-kernel', 'shared'] } } } },
            },

            // infrastructure -> own inner layers + shared/core.
            {
              from: { element: { type: 'feature-infrastructure' } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: ['feature-domain', 'feature-application', 'feature-infrastructure'],
                    },
                    captured: { feature: '{{ from.captured.feature }}' },
                  },
                },
              },
            },
            {
              from: { element: { type: 'feature-infrastructure' } },
              allow: {
                to: { element: { types: { anyOf: ['shared-kernel', 'shared', 'core'] } } },
              },
            },

            // ui -> own domain/application/ui + shared/core.
            {
              from: { element: { type: 'feature-ui' } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ['feature-domain', 'feature-application', 'feature-ui'] },
                    captured: { feature: '{{ from.captured.feature }}' },
                  },
                },
              },
            },
            {
              from: { element: { type: 'feature-ui' } },
              allow: {
                to: { element: { types: { anyOf: ['shared-kernel', 'shared', 'core'] } } },
              },
            },
            {
              from: { element: { type: 'feature-ui' } },
              disallow: { to: { element: { type: 'feature-infrastructure' } } },
              message:
                'UI must not see infrastructure. Depend on an application port and wire the adapter through the feature provider.',
            },

            // Other features are reachable only through their index.ts.
            {
              from: { element: { type: 'feature-ui' } },
              allow: {
                to: { element: { type: 'feature-root' }, file: { categories: 'feature-entry' } },
              },
            },

            // A feature's public API may re-export its own layers.
            {
              from: { element: { type: 'feature-root' } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        'feature-domain',
                        'feature-application',
                        'feature-infrastructure',
                        'feature-ui',
                      ],
                    },
                    captured: { feature: '{{ from.captured.feature }}' },
                  },
                },
              },
            },

            // Tests may reach anything inside their own feature.
            {
              from: { file: { categories: 'test' } },
              allow: {
                to: { element: { captured: { feature: '{{ from.captured.feature }}' } } },
              },
            },

            // shared knows nothing about features.
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { types: { anyOf: ['shared', 'shared-kernel'] } } } },
            },
            {
              from: { element: { type: 'shared-kernel' } },
              allow: { to: { element: { type: 'shared-kernel' } } },
            },
            {
              from: { element: { type: 'shared-testing' } },
              allow: { to: { element: { type: 'shared-kernel' } } },
            },

            // core is the composition root.
            {
              from: { element: { type: 'core' } },
              allow: {
                to: { element: { types: { anyOf: ['core', 'shared', 'shared-kernel'] } } },
              },
            },

            {
              from: { element: { types: { anyOf: ['app-shell', 'bootstrap'] } } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ['app-shell', 'core', 'shared', 'shared-kernel'] },
                  },
                },
              },
            },
            // core, app-shell and bootstrap wire features via their public API.
            {
              from: { element: { types: { anyOf: ['core', 'app-shell', 'bootstrap'] } } },
              allow: {
                to: { element: { type: 'feature-root' }, file: { categories: 'feature-entry' } },
              },
            },
          ],
        },
      ],
    },
  },

  {
    // Domain is pure functions and types, so keep it the simplest layer.
    name: 'project/layer-domain',
    files: [DOMAIN],
    rules: {
      complexity: ['error', 6],
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      'sonarjs/cognitive-complexity': ['error', 8],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-globals': [
        'error',
        ...BROWSER_GLOBALS.map((name) => ({
          name,
          message: 'Domain knows nothing about the browser. Move this behind a port.',
        })),
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@angular/*', '@angular/**', 'rxjs', 'rxjs/*'],
              message:
                'Domain must stay framework-agnostic: no Angular, no RxJS. Declare a port and implement it in infrastructure.',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'project/layer-application',
    files: [APPLICATION],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'no-restricted-globals': [
        'error',
        ...BROWSER_GLOBALS.map((name) => ({
          name,
          message: 'Use-cases talk to ports, never to browser APIs directly.',
        })),
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@angular/common/http',
                '@angular/common/http/*',
                '@angular/router',
                '@angular/router/*',
                '@angular/platform-browser',
                '@angular/platform-browser/*',
              ],
              message:
                'Application holds use-cases. HTTP, router and DOM belong to infrastructure/ui; depend on a port here.',
            },
          ],
        },
      ],
    },
  },
  {
    // Components run longer than use-cases, but logic still belongs to application.
    name: 'project/layer-ui',
    files: [UI],
    rules: {
      'max-lines': ['error', { max: 250, skipBlankLines: true, skipComments: true }],
      'no-restricted-globals': [
        'error',
        ...BROWSER_GLOBALS.filter((name) => name !== 'window' && name !== 'document').map(
          (name) => ({
            name,
            message: 'Touching browser APIs from UI signals leaking infrastructure.',
          }),
        ),
      ],
    },
  },
  {
    // Infrastructure is the adapter layer, so the dirty parts are allowed here.
    name: 'project/layer-infrastructure',
    files: [INFRASTRUCTURE],
    rules: {
      'no-restricted-globals': 'off',
    },
  },

  {
    name: 'project/tests',
    files: ['**/*.spec.ts', '**/*.test.ts'],
    plugins: { vitest },
    languageOptions: {
      globals: vitest.environments.env.globals,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/no-focused-tests': 'error',
      'vitest/no-disabled-tests': 'warn',
      'vitest/expect-expect': 'error',
      'vitest/no-identical-title': 'error',
      'vitest/valid-expect': 'error',
      'vitest/consistent-test-it': ['error', { fn: 'it' }],
      'vitest/prefer-lowercase-title': ['error', { ignore: ['describe'] }],

      // Mocks, fixtures and long describes make strict typing counterproductive here.
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
      'sonarjs/no-identical-functions': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'no-restricted-globals': 'off',
      'boundaries/no-unknown-files': 'off',
    },
  },
  {
    // Typed content literals are data, not logic: they run long by nature.
    name: 'project/content-literals',
    files: ['src/app/features/*/infrastructure/content/*-content.ts'],
    rules: {
      'max-lines': 'off',
    },
  },
  {
    // Last resort: if bootstrap fails there is nowhere else to log.
    name: 'project/bootstrap',
    files: ['src/main.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    // A feature's public API is the only legal index.ts.
    name: 'project/feature-barrels',
    files: ['src/app/features/*/index.ts'],
    rules: { 'check-file/no-index': 'off' },
  },
  {
    name: 'project/configs',
    files: ['*.mjs', '*.cjs', '*.js', '*.config.ts'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: {
      'no-console': 'off',
      'max-lines': 'off',
      'check-file/filename-naming-convention': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  },

  // Must stay last: turns off rules that conflict with Prettier.
  prettier,
);

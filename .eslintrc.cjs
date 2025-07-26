module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: false,
  },
  env: {
    node: true,
  },
  plugins: ['@eslint-community/eslint-comments', 'filenames', 'import', 'n', 'unicorn'],
  extends: [
    'eslint:recommended',
    'plugin:@eslint-community/eslint-comments/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:n/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  rules: {
    // Optional eslint rules:
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    'n/hashbang': 'off',
    'n/no-unpublished-import': [
      'error',
      {
        allowModules: [
          'aria-query',
          'date-fns',
          'get-stdin',
          'fuse.js',
          'find-up',
          'is-glob',
          'chalk',
          'ci-info',
          'content-tag-utils',
          'ember-template-recast',
          'eslint-formatter-kakoune',
          '@babel/generator',
          '@babel/parser',
          '@babel/plugin-syntax-typescript',
          '@babel/plugin-transform-typescript',
          'yargs',
          'v8-compile-cache',
          'micromatch',
          'globby',
          '@babel/traverse',
          'resolve',
        ],
      },
    ],
    curly: 'error',
    eqeqeq: 'error',
    'func-style': ['error', 'declaration'],
    'id-denylist': ['error', 'whitelist', 'whiteList', 'blacklist', 'blackList'],
    'new-parens': 'error',
    'no-async-promise-executor': 'error',
    'no-console': 'error',
    'no-duplicate-imports': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-implicit-coercion': 'error',
    'no-implied-eval': 'error',
    'no-lone-blocks': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-func': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-return-assign': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow-restricted-names': 'error',
    'no-template-curly-in-string': 'error',
    'no-throw-literal': 'error',
    'no-use-before-define': ['error', 'nofunc'],
    'no-useless-call': 'error',
    'no-useless-catch': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-constructor': 'error',
    'no-useless-escape': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-with': 'error',
    'object-shorthand': 'error',
    'prefer-numeric-literals': 'error',
    'prefer-promise-reject-errors': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    radix: 'error',
    'require-atomic-updates': 'error',
    'require-await': 'error',
    'spaced-comment': 'error',
    'wrap-iife': 'error',
    yoda: 'error',

    '@eslint-community/eslint-comments/no-unused-disable': 'error',

    'filenames/match-regex': ['error', '^.?[a-z0-9-]+$'], // Kebab-case.

    // Optional import rules:
    'import/extensions': ['error', 'always'],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'error',
    'import/no-deprecated': 'error',
    'import/no-dynamic-require': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-named-default': 'error',
    'import/no-self-import': 'error',
    'import/no-unassigned-import': 'error',
    'import/no-unused-modules': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-webpack-loader-syntax': 'error',
    'import/unambiguous': 'error',
    // broken -- does not support package.json#exports
    'import/no-unresolved': 'off',

    // Node rules:
    'n/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['dynamicImport', 'modules'], // False positives: https://github.com/mysticatea/eslint-plugin-node/issues/250
      },
    ],

    'n/no-extraneous-import': [
      'error',
      {
        allowModules: [],
      },
    ],

    // Unicorn rules:
    'unicorn/consistent-destructuring': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-lonely-if': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/text-encoding-identifier-case': 'off',
  },

  overrides: [
    {
      // CJS
      files: ['**/*.cjs'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['vitest.config.ts'],
      rules: {
        'filenames/match-regex': 'off',
        'import/no-unresolved': 'off',
        'import/extensions': 'off',
      },
    },
    {
      // CLI
      files: ['bin/**/*.js', 'lib/helpers/cli.js'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      // Rules
      files: ['lib/rules/**/*.js'],
      rules: {
        'filenames/match-exported': ['error', 'kebab'],
      },
    },
    {
      // Tests
      files: ['test/**/*.js'],
      env: {
        jest: true,
      },
      rules: {
        'import/no-dynamic-require': 'off',
      },
    },
  ],
};

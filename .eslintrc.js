module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'script',
  },
  env: {
    node: true,
  },
  plugins: [
    'eslint-comments',
    'filenames',
    'import',
    'import-helpers',
    'node',
    'prettier',
    'unicorn',
  ],
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:node/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'prettier/unicorn',
  ],
  rules: {
    // Optional eslint rules:
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    complexity: 'error',
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
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }], // Disallow unnecessary template literals.
    radix: 'error',
    'require-atomic-updates': 'error',
    'require-await': 'error',
    'spaced-comment': 'error',
    'wrap-iife': 'error',
    yoda: 'error',

    'eslint-comments/no-unused-disable': 'error',

    'filenames/match-regex': ['error', '^.?[a-z0-9-]+$'], // Kebab-case.

    // Optional import rules:
    'import/extensions': 'error',
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

    'import-helpers/order-imports': [
      'error',
      {
        newlinesBetween: 'always',
        groups: [
          '/^(assert|async_hooks|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|http2|https|inspector|module|net|os|path|perf_hooks|process|punycode|querystring|readline|repl|stream|string_decoder|timers|tls|trace_events|tty|url|util|v8|vm|zli)/',
          ['module'],
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: { order: 'asc', ignoreCase: true },
      },
    ],

    'prettier/prettier': 'error',

    // Unicorn rules:
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-lonely-if': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },

  overrides: [
    {
      files: ['bin/**/*.js'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['lib/rules/**/*.js'],
      rules: {
        'filenames/match-exported': ['error', 'kebab'],
      },
    },
    {
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

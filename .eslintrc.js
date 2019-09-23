module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
  },
  env: {
    node: true
  },
  plugins: [
    'eslint-comments',
    'filenames',
    'node',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:eslint-comments/recommended',
    'plugin:node/recommended',
    'prettier'
  ],
  rules: {
    // Optional eslint rules:
    'array-callback-return': 'error',
    'block-scoped-var': 'error',
    complexity: 'error',
    curly: 'error',
    eqeqeq: 'error',
    'func-style': ['error', 'declaration'],
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
    'no-return-await': 'error',
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
    radix: 'error',
    'require-atomic-updates': 'error',
    'require-await': 'error',
    'spaced-comment': 'error',
    'wrap-iife': 'error',
    yoda: 'error',

    'eslint-comments/no-unused-disable': 'error',

    'filenames/match-regex': ['error', '^[a-z0-9-]+$'], // Kebab-case.

    'prettier/prettier': 'error',
  },

  overrides: [
    {
      files: ['test/**/*.js'],
      env: {
        mocha: true,
      }
    }
  ],
};

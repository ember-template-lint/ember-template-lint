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

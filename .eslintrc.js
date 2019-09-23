module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
  },
  env: {
    node: true
  },
  plugins: [
    'filenames',
    'node',
    'prettier'
  ],
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  rules: {
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

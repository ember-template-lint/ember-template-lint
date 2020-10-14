module.exports = {
  plugins: [
    {
      name: 'plugin1',
      rules: {
        'inline-component': require('./rules/lint-inline-component')
      }
    }
  ],
  rules: {
    'inline-component': 'error',
    'no-bare-strings': 'error'
  }
};

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
    'inline-component': true,
    'no-bare-strings': true
  }
};

module.exports = {
  rules: {
    'no-bare-strings': true,
  },
  overrides: [
    {
      files: ['**/templates/**/*.hbs'],
      rules: {
        'no-implicit-this': true,
      },
    },
  ],
};

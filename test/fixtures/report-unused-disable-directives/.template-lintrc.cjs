module.exports = {
  reportUnusedDisableDirectives: true,
  rules: {
    'no-html-comments': 'error',
    'no-bare-strings': 'error',
    'no-builtin-form-components': 'error',
  },
  // Intentionally set up to make sure that we handle overrides correctly
  overrides: [
    {
      files: ['**/*'],
      rules: {
        'no-builtin-form-components': 'off',
      }
    }
  ]
};

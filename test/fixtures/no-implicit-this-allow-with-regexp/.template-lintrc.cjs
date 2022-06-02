module.exports = {
  rules: {
    'no-implicit-this': [
      'error',
      {
        allow: [/^data-test-/, 'book'],
      },
    ],
  },
};

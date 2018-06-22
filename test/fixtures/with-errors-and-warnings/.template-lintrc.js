module.exports = {
  rules: {
    'no-bare-strings': true,
    'no-html-comments': true
  },
  pending: [
    {
      'moduleId': './app/templates/application',
      'only': [
        'no-html-comments'
      ]
    }
  ]
};

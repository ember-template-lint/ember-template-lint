module.exports = {
  rules: {
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

module.exports = {
  rules: {
    'no-html-comments': true,
    'no-bare-strings': true
  },
  pending: [
    {
      'moduleId': 'app/templates/application',
      'only': [
        'no-html-comments', 'no-bare-strings'
      ]
    }
  ]
};

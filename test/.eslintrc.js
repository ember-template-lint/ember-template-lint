module.exports = {
  "env": {
    "mocha": true
  },
  rules: {
    // disabled because of Chai.js
    'no-unused-expressions': 'off',
    'quotes': [
      2,
      'single',
      { 'allowTemplateLiterals': true }
    ],
  },
};

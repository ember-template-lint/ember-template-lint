'use strict';

module.exports = {
  name: 'plugin1',

  rules: {
    'inline-component': require('./lint-inline-component'),
  },

  configurations: {
    recommended: {
      rules: {
        'inline-component': true,
        'no-bare-strings': true,
      },
    },
  },
};

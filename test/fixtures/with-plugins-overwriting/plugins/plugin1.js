'use strict';

module.exports = {
  name: 'plugin1',

  rules: {
    'inline-component': require('./lint-inline-component'),
  },

  configurations: {
    'enable-inline-component': {
      rules: {
        'inline-component': true,
      },
    },
  },
};

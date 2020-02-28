'use strict';

module.exports = {
  extends: ['recommended'],
  rules: {
    'no-action': 'error',
    'no-curly-component-invocation': {
      noImplicitThis: 'error',
      requireDash: 'off',
    },
    'no-implicit-this': 'error',
  },
};

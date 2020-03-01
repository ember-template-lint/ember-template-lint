'use strict';

module.exports = {
  extends: ['recommended'],
  rules: {
    'no-action': true,
    'no-curly-component-invocation': {
      noImplicitThis: true,
      requireDash: false,
    },
    'no-implicit-this': true,
  },
};

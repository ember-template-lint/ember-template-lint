'use strict';

module.exports = {
  extends: ['recommended'],
  rules: {
    'no-action': true,
    'no-args-paths': true,
    'no-curly-component-invocation': {
      noImplicitThis: true,
      requireDash: false,
    },
    'no-invalid-link-text': true,
    'no-invalid-meta': true,
    'require-button-type': true,
  },
};

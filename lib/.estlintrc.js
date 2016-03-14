'use strict';

module.exports = {
  "plugins": ["node"],

  env: {
    browser: false,
    node: true,
  },

  rules: {
    'node/no-missing-require': 2,
    'node/no-unsupported-features': [2, {version: 0.10}]
  }
};

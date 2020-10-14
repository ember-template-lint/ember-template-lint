'use strict';

let DEPRECATED_RULES = new Map([
  // deprecated in the 1.x cycle
  ['img-alt-attributes', 'require-valid-alt-text'],
  ['no-meta-redirect-with-time-limit', 'no-invalid-meta'],

  // deprecated in the 2.x cycle
  ['invocable-blacklist', 'no-restricted-invocations'],
]);

module.exports = DEPRECATED_RULES;

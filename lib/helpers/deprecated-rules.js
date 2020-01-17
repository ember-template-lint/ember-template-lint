'use strict';

let DEPRECATED_RULES = new Map([
  // deprecated in the 1.x cycle, can be removed in 3.x
  ['img-alt-attributes', 'require-valid-alt-text'],
  ['no-meta-redirect-with-time-limit', 'no-invalid-meta'],
]);

module.exports = DEPRECATED_RULES;

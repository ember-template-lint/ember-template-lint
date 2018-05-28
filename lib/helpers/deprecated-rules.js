'use strict';

let DEPRECATED_RULES = new Map([
  ['inline-styles', 'no-inline-styles'],
  ['bare-strings', 'no-bare-strings'],
  ['html-comments', 'no-html-comments'],
  ['invalid-interactive', 'no-invalid-interactive'],
  ['nested-interactive', 'no-nested-interactive'],
  ['triple-curlies', 'no-triple-curlies'],
  ['unused-block-params', 'no-unused-block-params'],
]);

module.exports = DEPRECATED_RULES;

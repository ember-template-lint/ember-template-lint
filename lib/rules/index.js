'use strict';

module.exports = {
  'bare-strings': require('./lint-bare-strings'),
  'block-indentation': require('./lint-block-indentation'),
  'html-comments': require('./lint-html-comments'),
  'img-alt-attributes': require('./lint-img-alt-attributes'),
  'link-rel-noopener': require('./lint-link-rel-noopener'),
  'triple-curlies': require('./lint-triple-curlies'),
  'self-closing-void-elements': require('./lint-self-closing-void-elements'),
  'nested-interactive': require('./lint-nested-interactive'),
  'inline-link-to': require('./lint-inline-link-to'),
  'deprecated-each-syntax': require('./deprecations/lint-deprecated-each-syntax'),
  'invalid-interactive': require('./lint-invalid-interactive')
};

'use strict';

module.exports = {
  'bare-strings': require('./lint-bare-strings'),
  'block-indentation': require('./lint-block-indentation'),
  'no-debugger': require('./lint-no-debugger'),
  'no-log': require('./lint-no-log'),
  'html-comments': require('./lint-html-comments'),
  'img-alt-attributes': require('./lint-img-alt-attributes'),
  'inline-styles': require('./lint-inline-styles'),
  'link-rel-noopener': require('./lint-link-rel-noopener'),
  'triple-curlies': require('./lint-triple-curlies'),
  'self-closing-void-elements': require('./lint-self-closing-void-elements'),
  'nested-interactive': require('./lint-nested-interactive'),
  'inline-link-to': require('./lint-inline-link-to'),
  'deprecated-each-syntax': require('./deprecations/lint-deprecated-each-syntax'),
  'deprecated-inline-view-helper': require('./deprecations/lint-deprecated-inline-view-helper'),
  'invalid-interactive': require('./lint-invalid-interactive'),
  'style-concatenation': require('./lint-style-concatenation'),
  'simple-unless': require('./lint-simple-unless'),
  'unused-block-params': require('./lint-unused-block-params'),
  'no-duplicate-attributes': require('./lint-duplicate-attributes'),
  'linebreak-style': require('./lint-linebreak-style'),
  'attribute-indentation': require('./lint-attribute-indentation'),
  'template-length': require('./lint-template-length'),
  'table-groups': require('./lint-table-groups'),
  'eol-last': require('./lint-eol-last'),
  'no-trailing-spaces': require('./lint-no-trailing-spaces')
};

'use strict';

module.exports = {
  'bare-strings': require('./lint-bare-strings'),
  'block-indentation': require('./lint-block-indentation'),
  'html-comments': require('./lint-html-comments'),
  'triple-curlies': require('./lint-triple-curlies'),
  'lint-self-closing-void-elements': require('./lint-self-closing-void-elements'),
  'nested-interactive': require('./lint-nested-interactive'),
  'deprecated-each-syntax': require('./deprecations/lint-deprecated-each-syntax')
};

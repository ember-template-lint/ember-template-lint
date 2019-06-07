'use strict';

/*
 Disallows self-closing void elements

 ```
 {{! good }}
 <hr>

 {{! bad}}
 <hr />
 ```

 The following values are valid configuration:

   * boolean -- `true` for enabled / `false` for disabled
 */

const Rule = require('./base');
const createErrorMessage = require('../helpers/create-error-message');

/**
 * [Specs of Void Elements]{@link https://www.w3.org/TR/html-markup/syntax.html#void-element}
 * @type {Object}
 */
const BLOCK_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'ul', 'ol', 'li', 'div'];

module.exports = class NoChildlessElements extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        return config;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      ['  * boolean - `true` to enable / `false` to disable'],
      config
    );

    throw new Error(errorMessage);
  }
  visitor() {
    return {
      ElementNode(node) {
        const isRuleEnabled = Boolean(this.config);
        const isNonVoidTag = BLOCK_TAGS.includes(node.tag);
        const isElementEmpty = !node.children.length;
        const shouldDisplayMessage = isRuleEnabled && isNonVoidTag && isElementEmpty;

        if (shouldDisplayMessage) {
          let source = this.sourceForNode(node).trim();

          this.log({
            message: 'Empty non-void elements are not allowed',
            line: node.loc.start.line,
            column: node.loc.start.column,
            source: source,
          });
        }
      },
    };
  }
};

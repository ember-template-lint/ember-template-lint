'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

const ERROR_MESSAGE =
  'The aria-hidden attribute should never be present on the <body> element, as it hides the entire document from assistive technology';

module.exports = class NoAriaHiddenBody extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let hasAriaHiddenBody =
          node.tag === 'body' && AstNodeInfo.hasAttribute(node, 'aria-hidden');
        if (hasAriaHiddenBody) {
          if (this.mode === 'fix') {
            node.attributes = node.attributes.filter((a) => a.name !== 'aria-hidden');
          } else {
            this.log({
              message: ERROR_MESSAGE,
              node,
              isFixable: true,
            });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

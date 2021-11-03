'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

const errorMessage =
  'No autofocus attribute allowed, as it reduces accessibility by moving users to an element without warning and context';

module.exports = class NoAutofocusAttribute extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const autofocusNode = AstNodeInfo.findAttribute(node, 'autofocus');
        if (autofocusNode) {
          if (this.mode === 'fix') {
            node.attributes = node.attributes.filter((a) => a !== autofocusNode);
          } else {
            this.log({
              message: errorMessage,
              isFixable: true,
              node: autofocusNode,
            });
          }
        }
      },
    };
  }
};

module.exports.errorMessage = errorMessage;

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
          this.log({
            message: errorMessage,
            isFixable: false,
            node: autofocusNode,
          });
        }
      },
    };
  }
};

module.exports.errorMessage = errorMessage;

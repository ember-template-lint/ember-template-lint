'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

const ERROR_MESSAGE =
  'No autofocus attribute allowed, as it reduces accessibility by moving users to an element without warning and context';

module.exports = class NoAutofocusAttribute extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const autofocusNode = AstNodeInfo.findAttribute(node, 'autofocus');
        if (autofocusNode) {
          this.log({
            message: ERROR_MESSAGE,
            isFixable: false,
            node: autofocusNode,
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

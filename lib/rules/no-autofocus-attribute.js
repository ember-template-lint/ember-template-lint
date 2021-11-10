'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

const ERROR_MESSAGE =
  'No autofocus attribute allowed, as it reduces accessibility by moving users to an element without warning and context';

function logAutofocusAttribute(attribute) {
  this.log({
    message: ERROR_MESSAGE,
    isFixable: false,
    node: attribute,
  });
}

module.exports = class NoAutofocusAttribute extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const autofocusAttribute = AstNodeInfo.findAttribute(node, 'autofocus');
        if (autofocusAttribute) {
          logAutofocusAttribute.call(this, autofocusAttribute);
        }
      },

      MustacheStatement(node) {
        const autofocusAttribute = node.hash.pairs.find((pair) => pair.key === 'autofocus');
        if (autofocusAttribute) {
          logAutofocusAttribute.call(this, autofocusAttribute);
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

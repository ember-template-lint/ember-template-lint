import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const ERROR_MESSAGE =
  'No autofocus attribute allowed, as it reduces accessibility by moving users to an element without warning and context';

function logAutofocusAttribute(attribute) {
  this.log({
    message: ERROR_MESSAGE,
    isFixable: false,
    node: attribute,
  });
}

export default class NoAutofocusAttribute extends Rule {
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
}

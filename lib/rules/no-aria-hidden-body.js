import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const ERROR_MESSAGE =
  'The aria-hidden attribute should never be present on the <body> element, as it hides the entire document from assistive technology';

export default class NoAriaHiddenBody extends Rule {
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
}

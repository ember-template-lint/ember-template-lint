import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

export function ERROR_MESSAGE_ARIA_UNSUPPORTED_PROPERTY(tag, name) {
  return `The <${tag}> element does not support the use of ARIA roles, states, and properties such as "${name}"`;
}
const NON_ARIA_ELEMENTS = new Set(['html', 'meta', 'script', 'style']);

export default class NoAriaUnsupportedElements extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const isReserved = NON_ARIA_ELEMENTS.has(node.tag);
        if (isReserved) {
          // Detect `role` attribute
          const hasRoleAttr = AstNodeInfo.findAttribute(node, 'role');
          if (hasRoleAttr) {
            this.log({
              message: ERROR_MESSAGE_ARIA_UNSUPPORTED_PROPERTY(node.tag, 'role'),
              node,
            });
          }

          // Detect `aria-*` attributes
          for (const attribute of node.attributes) {
            if (attribute.name.startsWith('aria-')) {
              this.log({
                message: ERROR_MESSAGE_ARIA_UNSUPPORTED_PROPERTY(node.tag, attribute.name),
                node,
              });
            }
          }
        }
      },
    };
  }
}

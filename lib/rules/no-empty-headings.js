import AstNodeInfo from '../helpers/ast-node-info.js';
import isAngleBracketComponent from '../helpers/is-angle-bracket-component.js';
import Rule from './_base.js';

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const ERROR_MESSAGE =
  'Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.';

function hasText(textNode) {
  const nbspRemoved = textNode.chars.replaceAll('&nbsp;', ' ');
  return nbspRemoved.trim().length > 0;
}

function isHidden(element) {
  const ariaHiddenAttr = AstNodeInfo.findAttribute(element, 'aria-hidden');

  return (
    (ariaHiddenAttr && ariaHiddenAttr.value.chars === 'true') ||
    AstNodeInfo.hasAttribute(element, 'hidden')
  );
}

function hasAllowedNode(nodes, scope) {
  for (const node of nodes) {
    const { type } = node;

    if (['MustacheStatement', 'BlockStatement'].includes(type)) {
      return true;
    }

    if (type === 'TextNode' && hasText(node)) {
      return true;
    }

    if (type === 'ElementNode') {
      if (isAngleBracketComponent(scope, node)) {
        return true;
      }

      if (!isHidden(node) && AstNodeInfo.hasChildren(node)) {
        if (hasAllowedNode(AstNodeInfo.childrenFor(node), scope)) {
          return true;
        }
      }
    }
  }

  return false;
}

export default class NoEmptyHeadings extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const role = AstNodeInfo.findAttribute(node, 'role');
        const hasHeadingRole = role && role.value.chars === 'heading';

        if (HEADINGS.has(node.tag) || hasHeadingRole) {
          if (isHidden(node)) {
            return;
          }

          if (!AstNodeInfo.hasChildren(node)) {
            this.log({
              message: ERROR_MESSAGE,
              node,
            });

            return;
          }

          const childNodes = AstNodeInfo.childrenFor(node);

          if (hasAllowedNode(childNodes, this.scope)) {
            return;
          }

          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
}

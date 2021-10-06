'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

const ERROR_MESSAGE =
  'Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.';
const headings = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function hasText(textNode) {
  const nbspRemoved = textNode.chars.replace(/&nbsp;/g, ' ');
  return nbspRemoved.trim().length > 0;
}

function isHidden(element) {
  const ariaHiddenAttr = AstNodeInfo.findAttribute(element, 'aria-hidden');

  return (
    (ariaHiddenAttr && ariaHiddenAttr.value.chars === 'true') ||
    AstNodeInfo.hasAttribute(element, 'hidden')
  );
}

function getTextNodes(nodes) {
  return nodes.filter((node) => node.type === 'TextNode');
}

module.exports = class NoEmptyHeadings extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const role = AstNodeInfo.findAttribute(node, 'role');
        const hasHeadingRole = role && role.value.chars === 'heading';

        if (headings.has(node.tag) || hasHeadingRole) {
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

          const nodeChildren = AstNodeInfo.childrenFor(node);
          const elementNodes = nodeChildren.filter((child) => child.type === 'ElementNode');

          for (const textNode of getTextNodes(nodeChildren)) {
            if (hasText(textNode)) {
              return;
            }
          }

          for (const element of elementNodes) {
            if (!isHidden(element)) {
              for (const textNode of getTextNodes(AstNodeInfo.childrenFor(element))) {
                if (hasText(textNode)) {
                  return;
                }
              }
            }
          }

          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

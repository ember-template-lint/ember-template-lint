'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

const ERROR_MESSAGE = 'Heading (h1, h2, etc.) must contain accessible text content.';
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
          const textNodes = getTextNodes(nodeChildren);
          const elementNodes = nodeChildren.filter((child) => child.type === 'ElementNode');
          let reachableText = 0;
          let elementTextNodes;

          for (const textNode of textNodes) {
            if (hasText(textNode)) {
              reachableText++;
            }
          }

          for (const element of elementNodes) {
            if (!isHidden(element)) {
              elementTextNodes = getTextNodes(AstNodeInfo.childrenFor(element));

              for (const textNode of elementTextNodes) {
                if (hasText(textNode)) {
                  reachableText++;
                }
              }
            }
          }

          if (!reachableText) {
            this.log({
              message: ERROR_MESSAGE,
              node,
            });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

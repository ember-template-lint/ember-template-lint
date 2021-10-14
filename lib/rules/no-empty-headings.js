'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const isAngleBracketComponent = require('../helpers/is-angle-bracket-component');
const Rule = require('./_base');

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const ERROR_MESSAGE =
  'Headings (h1, h2, etc. or ARIA:heading role elements) must contain accessible text content.';

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

function isAllowedNode(node, scope) {
  const { type } = node;

  if (type === 'TextNode') {
    return hasText(node);
  }

  if (type === 'ElementNode') {
    if (isAngleBracketComponent(scope, node)) {
      return true;
    }

    if (isHidden(node) || !AstNodeInfo.hasChildren(node)) {
      return false;
    }

    for (const childNode of AstNodeInfo.childrenFor(node)) {
      isAllowedNode(childNode, scope);
    }
  }

  return true;
}

module.exports = class NoEmptyHeadings extends Rule {
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

          const nodeChildren = AstNodeInfo.childrenFor(node);

          for (const childNode of nodeChildren) {
            if (isAllowedNode(childNode, this.scope)) {
              return;
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

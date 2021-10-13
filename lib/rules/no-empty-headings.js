'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
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

function getNodes(nodes, nodeType) {
  return nodes.filter((node) => node.type === nodeType);
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
          const elementNodes = getNodes(nodeChildren, 'ElementNode');
          const mustacheStatements = getNodes(nodeChildren, 'MustacheStatement');
          const blockStatements = getNodes(nodeChildren, 'BlockStatement');

          if (
            nodeChildren.length === mustacheStatements.length ||
            nodeChildren.length === blockStatements.length
          ) {
            return;
          }

          for (const textNode of getNodes(nodeChildren, 'TextNode')) {
            if (hasText(textNode)) {
              return;
            }
          }

          let childMustacheStatements;
          let childBlockStatements;

          for (const element of elementNodes) {
            if (!isHidden(element)) {
              childMustacheStatements = getNodes(
                AstNodeInfo.childrenFor(element),
                'MustacheStatement'
              );
              childBlockStatements = getNodes(AstNodeInfo.childrenFor(element), 'BlockStatement');

              if (
                AstNodeInfo.childrenFor(element).length >= childMustacheStatements.length ||
                AstNodeInfo.childrenFor(element).length >= childBlockStatements.length
              ) {
                return;
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

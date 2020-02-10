'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const ERROR_MESSAGE = 'Heading elements (h1-h6) should not be nested in `<button>` elements';

const DISALLOWED_HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

module.exports = class NoHeadingInsideButton extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const hasButtonRole = AstNodeInfo.hasAttributeValue(node, 'role', 'button');
        if (node.tag === 'button' || hasButtonRole) {
          const nodeChildren = AstNodeInfo.childrenFor(node);
          const elementChildren = nodeChildren.filter(child => AstNodeInfo.isElementNode(child));
          const hasInvalidChildElement = elementChildren.some(child =>
            DISALLOWED_HEADINGS.includes(child.tag)
          );
          if (hasInvalidChildElement) {
            this.log({
              message: ERROR_MESSAGE,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

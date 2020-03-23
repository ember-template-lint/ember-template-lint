'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE = 'Buttons should not contain heading elements';
const HEADING_ELEMENTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

function hasButtonParent(path) {
  let parents = Array.from(path.parents());
  let buttonElementInParentPath = parents.find(
    (parent) => parent.node.type === 'ElementNode' && parent.node.tag === 'button'
  );
  let buttonRoleInParentPath = parents.find(
    (parent) =>
      parent.node.type === 'ElementNode' &&
      AstNodeInfo.hasAttributeValue(parent.node, 'role', 'button')
  );
  if (buttonElementInParentPath || buttonRoleInParentPath) {
    return true;
  }
  return false;
}
module.exports = class NoHeadingInsideButton extends Rule {
  visitor() {
    return {
      ElementNode(node, path) {
        // Only heading elements: check rule conditions
        if (!HEADING_ELEMENTS.includes(node.tag)) {
          return;
        }

        // if it's a heading, check to see if one of the parent elements is a button
        if (hasButtonParent(path)) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

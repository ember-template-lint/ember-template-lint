'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE = 'Input elements require a valid associated label.';

function hasValidLabelParent(path) {
  // Parental validation (descriptive elements)
  let parents = Array.from(path.parents());
  let labelParentPath = parents.find(
    (parent) => parent.node.type === 'ElementNode' && parent.node.tag === 'label'
  );
  if (labelParentPath && AstNodeInfo.childrenFor(labelParentPath.node).length > 1) {
    return true;
  }

  return false;
}

module.exports = class RequireInputLabel extends Rule {
  visitor() {
    return {
      ElementNode(node, path) {
        // Only input elements: check rule conditions
        if (node.tag !== 'input' && node.tag !== 'Input') {
          return;
        }

        if (hasValidLabelParent(path)) {
          return;
        }

        // An input can be validated by either:
        // Self-validation (descriptive attributes)
        let validAttributesList = ['id', 'aria-label', 'aria-labelledby', '...attributes'];
        let hasValidAttributes = AstNodeInfo.hasAnyAttribute(node, validAttributesList);
        if (hasValidAttributes) {
          return;
        }

        this.log({
          message: ERROR_MESSAGE,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
        });
      },

      MustacheStatement(node, path) {
        if (node.path.type !== 'PathExpression' || node.path.original !== 'input') {
          return;
        }

        if (hasValidLabelParent(path)) {
          return;
        }

        if (node.hash.pairs.some((pair) => pair.key === 'id')) {
          return;
        }

        this.log({
          message: ERROR_MESSAGE,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
        });
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

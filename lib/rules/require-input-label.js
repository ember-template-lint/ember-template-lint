'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const ERROR_MESSAGE_NO_LABEL = 'Input elements require a valid associated label.';
const ERROR_MESSAGE_MULTIPLE_LABEL = 'Input elements should not have multiple valid labels.';

function hasValidLabelParent(path) {
  // Parental validation (descriptive elements)
  let parents = [...path.parents()];
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

        if (AstNodeInfo.hasAttribute(node, '...attributes')) {
          return;
        }

        let labelCount = 0;

        if (hasValidLabelParent(path)) {
          labelCount++;
        }

        const typeAttribute = AstNodeInfo.findAttribute(node, 'type');
        if (typeAttribute && typeAttribute.value.chars === 'hidden') {
          return;
        }

        // An input can be validated by either:
        // Self-validation (descriptive attributes)
        let validAttributesList = ['id', 'aria-label', 'aria-labelledby'];
        let attributes = validAttributesList.filter((name) => AstNodeInfo.hasAttribute(node, name));
        labelCount += attributes.length;
        if (labelCount === 1) {
          return;
        }

        let message = labelCount === 0 ? ERROR_MESSAGE_NO_LABEL : ERROR_MESSAGE_MULTIPLE_LABEL;
        this.log({
          message,
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

        const typeAttribute = node.hash.pairs.find((pair) => pair.key === 'type');
        if (typeAttribute && typeAttribute.value.value === 'hidden') {
          return;
        }

        if (node.hash.pairs.some((pair) => pair.key === 'id')) {
          return;
        }

        this.log({
          message: ERROR_MESSAGE_NO_LABEL,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
        });
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE_NO_LABEL;
module.exports.ERROR_MESSAGE_MULTIPLE_LABEL = ERROR_MESSAGE_MULTIPLE_LABEL;

'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE = 'Error Message to Report';

module.exports = class FindAncestor extends Rule {
  visitor() {
    // Start at root of node tree -- no parent
    this._parentNode = null;

    return {
      ElementNode: {
        enter(node) {
          // Always: check parent + self-assign if it doesn't exist
          if (!this._parentNode) {
            this._parentNode = node;
          }

          // Only input elements: check rule conditions
          let isInput = node.tag.toLowerCase() === 'input';
          if (!isInput) {
            return;
          }

          // An input can be validated by either:
          // Self-validation (descriptive attributes)
          let validAttributesList = ['id', 'aria-label', 'aria-labelledby'];
          let hasValidAttributes = AstNodeInfo.hasAnyAttribute(node, validAttributesList);

          // OR:
          // Parental validation (descriptive elements)
          let hasLabelParent = this._parentNode.tag.toLowerCase() === 'label';

          let passingCondition = hasLabelParent || hasValidAttributes;

          if (!passingCondition) {
            this.log({
              message: ERROR_MESSAGE,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        },
        exit(node) {
          if (this._parentNode === node) {
            this._parentNode = null;
          }
        },
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

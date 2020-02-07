'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE = 'Input elements require an associated label.';

module.exports = class RequireInputLabel extends Rule {
  visitor() {
    // Start at root of node tree -- no parent
    this._parentStack = [];

    return {
      ElementNode: {
        enter(node) {
          this._parentStack.push(node.tag.toLowerCase());

          // Only input elements: check rule conditions
          if (!AstNodeInfo.isInputElement(node)) {
            return;
          }

          // An input can be validated by either:
          // Self-validation (descriptive attributes)
          let validAttributesList = ['id', 'aria-label', 'aria-labelledby'];
          let hasValidAttributes = AstNodeInfo.hasAnyAttribute(node, validAttributesList);

          // OR:
          // Parental validation (descriptive elements)
          let hasLabelParent = this._parentStack.includes('label');

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
          if (node.tag === 'label') {
            this._parentStack.pop();
          }
        },
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

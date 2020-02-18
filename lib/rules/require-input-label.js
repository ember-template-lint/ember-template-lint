'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');
// const iterateParents = require('../helpers/iterate-parents');

const ERROR_MESSAGE = 'Input elements require an associated label.';

module.exports = class RequireInputLabel extends Rule {
  visitor() {
    return {
      ElementNode(node, path) {
        // Only input elements: check rule conditions
        if (!AstNodeInfo.isInputElement(node)) {
          return;
        }

        // An input can be validated by either:
        // Self-validation (descriptive attributes)
        let validAttributesList = ['id', 'aria-label', 'aria-labelledby', '...attributes'];
        let hasValidAttributes = AstNodeInfo.hasAnyAttribute(node, validAttributesList);
        if (hasValidAttributes) {
          return;
        }

        // OR:
        // Parental validation (descriptive elements)
        let parents = Array.from(path.parents());
        if( parents.some(parent => parent.node.type === 'ElementNode' && parent.node.tag === 'label' )){
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

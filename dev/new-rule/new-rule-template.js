'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

// *** Change template to 'Real Error Message to Report' ***
const ERROR_MESSAGE = 'Error Message to Report';

// *** Change template to `RealRuleName` ***
module.exports = class MyNewRule extends Rule {
  visitor() {
    return {
      // *** Change template example to `RealNodeType` + Real Rule Conditions ***
      // Simple template example: disallowed text present in TextNode
      TextNode(node) {
        let source = this.sourceForNode(node);
        let disallowedText = 'DisallowedText';
        let failingCondition = source.includes(disallowedText);
        if (failingCondition) {
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

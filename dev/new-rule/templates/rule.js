'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

// TODO Change template to the real error message that you want to report
const ERROR_MESSAGE = 'Error Message to Report';

module.exports = class PlaceholderForRuleClass extends Rule {
  visitor() {
    return {
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

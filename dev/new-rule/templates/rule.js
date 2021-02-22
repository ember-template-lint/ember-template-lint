'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

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
            node,
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

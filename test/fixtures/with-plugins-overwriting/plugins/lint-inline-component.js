'use strict';


var Rule = require('../../../../lib/rules/base');
var message = 'The inline form of component is not allowed';

module.exports = class InlineComponent extends Rule {
  visitors() {
    return {
      MustacheStatement(node) {
        if (node.path.original === 'component') {
          this.log({
            message: message,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node)
          });
        }
      }
    };
  }
};

module.exports.message = message;

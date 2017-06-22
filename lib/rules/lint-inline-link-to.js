'use strict';

const Rule = require('./base');
const message = 'The inline form of link-to is not allowed. Use the block form instead.';

module.exports = class InlineLinkTo extends Rule {
  visitors() {
    return {
      MustacheStatement(node) {
        if (node.path.original === 'link-to') {
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

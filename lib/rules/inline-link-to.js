'use strict';

const Rule = require('./base');
const query = require('./../hbsquery/query');
const message = 'The inline form of link-to is not allowed. Use the block form instead.';

module.exports = class InlineLinkTo extends Rule {
  visitor() {
    return {
      Template(node) {
        console.log(JSON.stringify(query(node, 'PathExpression[original="link-to"]')));
      },
      MustacheStatement(node) {
        if (node.path.original === 'link-to') {
          this.log({
            message,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.message = message;

'use strict';

let Rule = require('../../../../lib/rules/_base');

let message = 'The inline form of component is not allowed';

module.exports = class InlineComponent extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.original === 'component') {
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

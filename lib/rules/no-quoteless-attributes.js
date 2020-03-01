'use strict';

const Rule = require('./base');

module.exports = class NoQuotelessAttributes extends Rule {
  visitor() {
    return {
      TextNode(node, path) {
        if (path.parentNode.type !== 'AttrNode') {
          return;
        }

        let attribute = path.parentNode;
        let element = path.parent.parentNode;

        let { isValueless, quoteType } = attribute;

        if (isValueless) {
          return;
        }

        if (quoteType === null) {
          this.log({
            message: `Attribute ${attribute.name} should be either quoted or wrapped in mustaches`,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(element),
          });
        }
      },
    };
  }
};

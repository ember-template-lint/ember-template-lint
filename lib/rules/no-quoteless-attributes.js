'use strict';

const Rule = require('./_base');

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
          let type = attribute.name.startsWith('@') ? 'Argument' : 'Attribute';

          this.log({
            message: `${type} ${attribute.name} should be either quoted or wrapped in mustaches`,
            node,
            source: this.sourceForNode(element),
          });
        }
      },
    };
  }
};

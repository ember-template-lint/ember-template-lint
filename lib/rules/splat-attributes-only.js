'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'Only `...attributes` can be applied to elements';

module.exports = class SplatAttributesOnly extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        if (node.name.startsWith('...') && node.name !== '...attributes') {
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

'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'Yielding block params to else/inverse block is not allowed';

module.exports = class NoYieldBlockParamsToElseInverse extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.original === 'yield') {
          let isElseInverseHashPair = node.hash.pairs.some((p) => {
            return p.key === 'to' && ['else', 'inverse'].includes(p.value.value);
          });

          if (isElseInverseHashPair) {
            this.log({
              message: ERROR_MESSAGE,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

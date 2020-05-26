'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'You should not yield to default';

const DISALLOWED_PATHS = new Set([
  'yield',
  'has-block',
  'has-block-params',
  'hasBlock',
  'hasBlockParams',
]);

module.exports = class NoYieldToDefault extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (DISALLOWED_PATHS.has(node.path.original)) {
          let isDefaultHashPair = node.hash.pairs.some((p) => {
            return p.key === 'to' && p.value.value === 'default';
          });

          let isDefaultParams = node.params.some((p) => {
            return p.type === 'StringLiteral' && p.value === 'default';
          });

          if (isDefaultHashPair || isDefaultParams) {
            this.log({
              message: ERROR_MESSAGE,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }
      },
      SubExpression(node) {
        if (DISALLOWED_PATHS.has(node.path.original)) {
          let isDefaultParams = node.params.some((p) => {
            return p.type === 'StringLiteral' && p.value === 'default';
          });

          if (isDefaultParams) {
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

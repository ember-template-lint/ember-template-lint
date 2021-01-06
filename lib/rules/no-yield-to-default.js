'use strict';

const { match } = require('../helpers/node-matcher');
const Rule = require('./base');

const ERROR_MESSAGE = 'A block named "default" is not valid';

const BLOCK_PARAM_KEYWORDS = ['has-block', 'has-block-params', 'hasBlock', 'hasBlockParams'];

function isYield(node) {
  return match(node, { type: 'PathExpression', original: 'yield' });
}

function isBlockParamKeyword(node) {
  return BLOCK_PARAM_KEYWORDS.some((keyword) =>
    match(node, { type: 'PathExpression', original: keyword })
  );
}

module.exports = class NoYieldToDefault extends Rule {
  handleBlockParamKeyword(node) {
    let [toParam] = node.params;

    if (match(toParam, { type: 'StringLiteral', value: 'default' })) {
      this.log({
        message: ERROR_MESSAGE,
        line: toParam.loc && toParam.loc.start.line,
        column: toParam.loc && toParam.loc.start.column,
        source: this.sourceForNode(toParam),
      });
    }
  }

  visitor() {
    return {
      MustacheStatement(node) {
        if (isYield(node.path)) {
          let toHashPair = node.hash.pairs.find((p) => p.key === 'to');

          if (match(toHashPair, { value: { type: 'StringLiteral', value: 'default' } })) {
            this.log({
              message: ERROR_MESSAGE,
              line: toHashPair.loc && toHashPair.loc.start.line,
              column: toHashPair.loc && toHashPair.loc.start.column,
              source: this.sourceForNode(toHashPair),
            });
          }
        } else if (isBlockParamKeyword(node.path)) {
          this.handleBlockParamKeyword(node);
        }
      },

      SubExpression(node) {
        if (isBlockParamKeyword(node.path)) {
          this.handleBlockParamKeyword(node);
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

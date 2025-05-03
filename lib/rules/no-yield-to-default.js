import { match } from '../helpers/node-matcher.js';
import Rule from './_base.js';

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

export default class NoYieldToDefault extends Rule {
  handleBlockParamKeyword(node) {
    let [toParam] = node.params;

    if (match(toParam, { type: 'StringLiteral', value: 'default' })) {
      this.log({
        message: ERROR_MESSAGE,
        node: toParam,
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
              node: toHashPair,
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
}

import Rule from './_base.js';

const ERROR_MESSAGE = 'Yielding block params to else/inverse block is not allowed';

export default class NoYieldBlockParamsToElseInverse extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<NoYieldBlockParamsToElseInverse>}
   */
  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.original === 'yield' && node.params.length) {
          let isElseInverseHashPair = node.hash.pairs.some((p) => {
            const isStringValue = p.value.type === 'StringLiteral';
            return p.key === 'to' && isStringValue && ['else', 'inverse'].includes(p.value.value);
          });

          if (isElseInverseHashPair) {
            this.log({
              message: ERROR_MESSAGE,
              node,
            });
          }
        }
      },
    };
  }
}

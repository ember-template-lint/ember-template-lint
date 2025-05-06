import Rule from './_base.js';

const ERROR_MESSAGE = 'Yielding block params to else/inverse block is not allowed';

export default class NoYieldBlockParamsToElseInverse extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<NoYieldBlockParamsToElseInverse>}
   */
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
              node,
            });
          }
        }
      },
    };
  }
}

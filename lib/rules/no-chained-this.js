import Rule from './_base.js';

export const ERROR_MESSAGE =
  'this.this.* is not allowed in templates. This is likely a mistake — remove the redundant this.';

export default class NoChainedThis extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<NoChainedThis>}
   */
  visitor() {
    return {
      PathExpression(node) {
        if (node.original.startsWith('this.this.')) {
          if (this.mode === 'fix') {
            node.original = node.original.replace('this.this.', 'this.');
          } else {
            this.log({
              message: ERROR_MESSAGE,
              isFixable: true,
              node,
            });
          }
        }
      },
      ElementNode(node) {
        if (node.tag.startsWith('this.this.')) {
          if (this.mode === 'fix') {
            node.tag = node.tag.replace('this.this.', 'this.');
          } else {
            this.log({
              message: ERROR_MESSAGE,
              isFixable: true,
              node,
            });
          }
        }
      },
    };
  }
}

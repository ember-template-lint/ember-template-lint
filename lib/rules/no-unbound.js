import Rule from './_base.js';

const message = 'Unexpected {{unbound}} usage.';

export default class NoUnbound extends Rule {
  _checkForUnbound(node) {
    if (node.path.original === 'unbound') {
      this.log({
        message,
        node,
      });
    }
  }

  visitor() {
    return {
      MustacheStatement(node) {
        this._checkForUnbound(node);
      },

      BlockStatement(node) {
        this._checkForUnbound(node);
      },

      SubExpression(node) {
        this._checkForUnbound(node);
      },
    };
  }
}

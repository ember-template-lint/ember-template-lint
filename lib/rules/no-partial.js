import Rule from './_base.js';

const message = 'Unexpected {{partial}} usage.';

export default class NoPartial extends Rule {
  _checkForPartial(node) {
    if (node.path.original === 'partial') {
      this.log({
        message,
        node,
      });
    }
  }

  visitor() {
    return {
      MustacheStatement(node) {
        this._checkForPartial(node);
      },
    };
  }
}

import Rule from './_base.js';

const message = 'Unexpected block usage. The {{input}} helper may only be used inline.';

export default class NoInputBlock extends Rule {
  _checkForInput(node) {
    if (node.path.original === 'input') {
      this.log({
        message,
        node,
      });
    }
  }

  visitor() {
    return {
      BlockStatement(node) {
        this._checkForInput(node);
      },
    };
  }
}

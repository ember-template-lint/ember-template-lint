'use strict';

const Rule = require('./_base');

const message = 'Unexpected block usage. The {{input}} helper may only be used inline.';

module.exports = class NoInputBlock extends Rule {
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
};

module.exports.message = message;

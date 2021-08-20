'use strict';

const Rule = require('./_base');

const message = 'Unexpected {{unbound}} usage.';

module.exports = class NoUnbound extends Rule {
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
};

module.exports.message = message;

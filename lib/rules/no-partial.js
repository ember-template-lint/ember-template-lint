'use strict';

const Rule = require('./_base');

const message = 'Unexpected {{partial}} usage.';

module.exports = class NoPartial extends Rule {
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
};

module.exports.message = message;

'use strict';

const Rule = require('./_base');

const ERROR_MESSAGE = '{{yield}}-only templates are not allowed';

module.exports = class NoYieldOnly extends Rule {
  visitor() {
    if (this._rawSource.trim() !== '{{yield}}') {
      return;
    }

    return {
      MustacheStatement(node) {
        this.log({
          message: ERROR_MESSAGE,
          node,
        });
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

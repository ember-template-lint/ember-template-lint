'use strict';

const Rule = require('./base');

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
          line: node.loc.start.line,
          column: node.loc.start.column,
          source: this.sourceForNode(node),
        });
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

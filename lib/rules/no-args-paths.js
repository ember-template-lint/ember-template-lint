'use strict';

const Rule = require('./base');

module.exports = class NoArgsPaths extends Rule {
  visitor() {
    const isLocal = this.isLocal.bind(this);
    const sourceForNode = this.sourceForNode.bind(this);
    const log = this.log.bind(this);
    function checkPathForArgs(node) {
      if (node.parts && node.parts[0] === 'args') {
        if (node.data) {
          return false;
        }
        if (isLocal(node)) {
          return false;
        }
        return node.parts.length !== 1;
      }
      return false;
    }
    function lintArgsUsage(node) {
      const possibleLintError = checkPathForArgs(node);
      if (possibleLintError === true) {
        log({
          message: `Component templates should avoid "${
            node.original
          }" usage, try "@${node.parts.slice(1).join('.')}" instead.`,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: sourceForNode(node),
        });
      }
    }

    return {
      PathExpression(node) {
        lintArgsUsage(node);
      },
    };
  }
};

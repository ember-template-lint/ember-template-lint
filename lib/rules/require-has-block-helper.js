'use strict';

const Rule = require('./base');

const TRANSFORMATIONS = {
  hasBlock: 'has-block',
  hasBlockParams: 'has-block-params',
};

function getErrorMessage(name) {
  return `\`${name}\` is deprecated. Use the \`${TRANSFORMATIONS[name]}\` helper instead.`;
}

module.exports = class RequireHasBlockHelper extends Rule {
  visitor() {
    return {
      PathExpression(node) {
        if (TRANSFORMATIONS[node.original]) {
          this.log({
            message: getErrorMessage(node.original),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.getErrorMessage = getErrorMessage;

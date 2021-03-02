'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const ERROR_MESSAGE_FLIP_IF =
  'Change `{{if (not condition)}} {{prop1}} {{else}} {{prop2}} {{/if}}` to `{{if condition}} {{prop2}} {{else}} {{prop1}} {{/if}}`.';
const ERROR_MESSAGE_USE_IF = 'Change `unless (not condition)` to `if condition`.';
const ERROR_MESSAGE_USE_UNLESS = 'Change `if (not condition)` to `unless condition`.';

module.exports = class NoNegatedCondition extends Rule {
  visitor() {
    function checkNode(node) {
      const isIf = AstNodeInfo.isIf(node);
      const isUnless = AstNodeInfo.isUnless(node);
      if (!isIf && !isUnless) {
        // Not a conditional statement.
        return;
      }

      if (node.type === 'BlockStatement') {
        if (this.sourceForNode(node).startsWith('{{else ')) {
          // We only care about the beginning of the overall `if` / `unless` statement so ignore the `else` parts.
          return;
        }

        if (
          node.inverse &&
          node.inverse.body.length > 0 &&
          node.inverse.body[0].type === 'BlockStatement' &&
          isIf &&
          AstNodeInfo.isIf(node.inverse.body[0])
        ) {
          // Ignore `if ... else if ...` statements as there may be no way to avoid negated conditions inside them.
          return;
        }
      }

      if (
        node.params.length === 0 ||
        node.params[0].type !== 'SubExpression' ||
        node.params[0].path.type !== 'PathExpression' ||
        node.params[0].path.original !== 'not'
      ) {
        // No negation present.
        return;
      }

      if (isIf && node.params[0].params[0].type === 'SubExpression') {
        // We don't want to suggest converting to `unless` when there are helpers
        // in the condition, as the `simple-unless` rule does not permit that.
        return;
      }

      // Determine what error message to show:
      const isIfElseBlockStatement = node.type === 'BlockStatement' && node.inverse;
      const isIfElseNonBlockStatement = node.type !== 'BlockStatement' && node.params.length === 3;
      const shouldFlipCondition = isIfElseBlockStatement || isIfElseNonBlockStatement;
      const message = isUnless
        ? ERROR_MESSAGE_USE_IF
        : shouldFlipCondition
        ? ERROR_MESSAGE_FLIP_IF
        : ERROR_MESSAGE_USE_UNLESS;

      this.log({
        message,
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: this.sourceForNode(node),
      });
    }

    return {
      BlockStatement: checkNode,
      MustacheStatement: checkNode,
      SubExpression: checkNode,
    };
  }
};

module.exports.ERROR_MESSAGE_FLIP_IF = ERROR_MESSAGE_FLIP_IF;
module.exports.ERROR_MESSAGE_USE_IF = ERROR_MESSAGE_USE_IF;
module.exports.ERROR_MESSAGE_USE_UNLESS = ERROR_MESSAGE_USE_UNLESS;

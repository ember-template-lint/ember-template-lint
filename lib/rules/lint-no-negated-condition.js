'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE_FLIP_IF = 'Flip `if` statement to avoid `if !condition`.';
const ERROR_MESSAGE_USE_IF = 'Use `if` instead of `unless !condition`.';
const ERROR_MESSAGE_USE_UNLESS = 'Use `unless` instead of `if !condition`.';

module.exports = class NoNegatedCondition extends Rule {
  visitor() {
    function checkNode(node) {
      const isIf = node.path && node.path.original === 'if';
      const isUnless = node.path && node.path.original === 'unless';
      if (!isIf && !isUnless) {
        // Not a conditional statement.
        return;
      }

      if (AstNodeInfo.isBlockStatement(node)) {
        if (node.inverse && node.inverse.body.length > 0) {
          // Conditional block statement has an `else` / `else if`

          const firstNode = findFirstNonTextNonCommentNode(node.inverse.body);
          if (firstNode && AstNodeInfo.isBlockStatement(firstNode)) {
            // If there's BlockStatement directly inside the body of the `else`,
            // we need to mark it so we can ignore it later,
            // to avoid potentially suggesting an `unless` after an `else`.
            firstNode.isAtBeginningOfElseBody = true;

            if (isIf && firstNode.path.original === 'if') {
              // Ignore `if ... else if ...` statements as there's nothing wrong with them.
              return;
            }
          }
        }

        if (isIf && node.isAtBeginningOfElseBody) {
          // Ignore `if` statements directly following an `else` due to complexity.
          return;
        }
      }

      if (
        node.params.length > 0 &&
        AstNodeInfo.isSubExpression(node.params[0]) &&
        AstNodeInfo.isPathExpression(node.params[0].path) &&
        node.params[0].path.original === 'not'
      ) {
        // Determine what error message to show:
        const isIfElseBlockStatement = AstNodeInfo.isBlockStatement(node) && node.inverse;
        const isIfElseNonBlockStatement =
          !AstNodeInfo.isBlockStatement(node) && node.params.length === 3;
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
    }

    return {
      BlockStatement: checkNode,
      MustacheStatement: checkNode,
      SubExpression: checkNode,
    };
  }
};

function findFirstNonTextNonCommentNode(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    const currentNode = nodes[i];
    if (
      !AstNodeInfo.isTextNode(currentNode) &&
      !AstNodeInfo.isMustacheCommentStatement(currentNode)
    ) {
      return currentNode;
    }
  }
  return null;
}

module.exports.ERROR_MESSAGE_FLIP_IF = ERROR_MESSAGE_FLIP_IF;
module.exports.ERROR_MESSAGE_USE_IF = ERROR_MESSAGE_USE_IF;
module.exports.ERROR_MESSAGE_USE_UNLESS = ERROR_MESSAGE_USE_UNLESS;

import AstNodeInfo from '../helpers/ast-node-info.js';
import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

const ERROR_MESSAGE_FLIP_IF =
  'Change `{{if (not condition)}} {{prop1}} {{else}} {{prop2}} {{/if}}` to `{{if condition}} {{prop2}} {{else}} {{prop1}} {{/if}}`.';
const ERROR_MESSAGE_USE_IF = 'Change `unless (not condition)` to `if condition`.';
const ERROR_MESSAGE_USE_UNLESS = 'Change `if (not condition)` to `unless condition`.';
const ERROR_MESSAGE_NEGATED_HELPER = 'Simplify unnecessary negation of helper.';

const DEFAULT_CONFIG = {
  simplifyHelpers: true,
};

function isValidConfigObjectFormat(config) {
  for (let key in DEFAULT_CONFIG) {
    let value = config[key];

    if (value === undefined) {
      config[key] = DEFAULT_CONFIG[key];
    } else if (typeof value !== 'boolean') {
      return false;
    }
  }

  return true;
}

export default class NoNegatedCondition extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        return config ? DEFAULT_CONFIG : false;
      }
      case 'object': {
        if (isValidConfigObjectFormat(config)) {
          return config;
        }
        break;
      }
      case 'undefined': {
        return false;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean -- `true` for enabled / `false` for disabled\n' +
          '  * object --\n' +
          '    *  `simplifyHelpers` -- boolean - whether to flag and autofix negated helpers like `(not (eq ...))` or `(not (gt ...))` that can be simplified (default `true`)',
      ],
      config
    );

    throw new Error(errorMessage);
  }
  visitor() {
    function hasNestedFixableHelper(node) {
      return (
        node.params[0].params[0].path &&
        ['not', 'eq', 'not-eq', 'gt', 'gte', 'lt', 'lte'].includes(
          node.params[0].params[0].path.original
        )
      );
    }

    function hasNotHelper(node) {
      return (
        node.params.length &&
        node.params[0].type === 'SubExpression' &&
        node.params[0].path.type === 'PathExpression' &&
        node.params[0].path.original === 'not'
      );
    }

    function fixNestedHelper(node) {
      switch (node.params[0].path.original) {
        case 'not': {
          if (node.params[0].params.length > 1) {
            node.params[0].path.original = 'or';
          } else {
            node.params[0] = node.params[0].params[0];
          }
          break;
        }
        case 'eq': {
          node.params[0].path.original = 'not-eq';
          break;
        }
        case 'not-eq': {
          node.params[0].path.original = 'eq';
          break;
        }
        case 'gt': {
          node.params[0].path.original = 'lte';
          break;
        }
        case 'gte': {
          node.params[0].path.original = 'lt';
          break;
        }
        case 'lt': {
          node.params[0].path.original = 'gte';
          break;
        }
        case 'lte': {
          node.params[0].path.original = 'gt';
          break;
        }

        default: {
          break;
        }
      }
    }

    function checkNode(node) {
      const isIf = AstNodeInfo.isIf(node);
      const isUnless = AstNodeInfo.isUnless(node);
      const { simplifyHelpers } = this.config;
      if (!isIf && !isUnless) {
        // Not a conditional statement.
        return;
      }

      if (node.type === 'BlockStatement') {
        if (this.sourceForNode(node).startsWith('{{else ')) {
          // We mostly care about the beginning of the overall `if` / `unless` statement so ignore the `else` parts
          // unless it has negated fixable helper.
          if (!simplifyHelpers) {
            return;
          }
          if (!hasNotHelper(node)) {
            return;
          }

          if (!hasNestedFixableHelper(node)) {
            return;
          }
          if (this.mode === 'fix') {
            node.params[0] = node.params[0].params[0]; // Unwrap condition to remove `not`
            fixNestedHelper(node);
          } else {
            this.log({
              message: ERROR_MESSAGE_NEGATED_HELPER,
              node,
              isFixable: true,
            });
          }
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

      if (!hasNotHelper(node)) {
        // No negation present.
        return;
      }

      const hasFixableHelper = hasNestedFixableHelper(node);
      if (
        isIf &&
        node.params[0].params[0].type === 'SubExpression' &&
        (!simplifyHelpers || !hasFixableHelper)
      ) {
        // We don't want to suggest converting to `unless` when there are helpers
        // in the condition, as the `simple-unless` rule does not permit that.
        // Some helpers are exception as we can easy simplify them.
        return;
      }

      if (node.params[0].params.length > 1) {
        // More than one parameter to not helper means there is no way to simplify that
        return;
      }

      // Determine what error message to show:
      const isIfElseBlockStatement = node.type === 'BlockStatement' && node.inverse;
      const isIfElseNonBlockStatement = node.type !== 'BlockStatement' && node.params.length === 3;
      const shouldFlipCondition = isIfElseBlockStatement || isIfElseNonBlockStatement;
      const message = hasFixableHelper
        ? ERROR_MESSAGE_NEGATED_HELPER
        : isUnless
          ? ERROR_MESSAGE_USE_IF
          : shouldFlipCondition
            ? ERROR_MESSAGE_FLIP_IF
            : ERROR_MESSAGE_USE_UNLESS;

      // Autofix
      if (this.mode === 'fix') {
        node.params[0] = node.params[0].params[0]; // Unwrap condition to remove `not`
        if (hasFixableHelper) {
          fixNestedHelper(node);
          return;
        }
        if (isUnless || !shouldFlipCondition) {
          // if => unless or unless => if
          node.path.original = node.path.original === 'unless' ? 'if' : 'unless'; // Swap if/unless
        } else {
          // if _ a b => if _ b a
          if (isIfElseBlockStatement) {
            // Flip blocks.
            const programBody = node.program.body;
            node.program.body = node.inverse.body;
            node.inverse.body = programBody;
          } else {
            // Flip params.
            const param2 = node.params[2];
            node.params[2] = node.params[1];
            node.params[1] = param2;
          }
        }
      } else {
        this.log({
          message,
          node,
          isFixable: true,
        });
      }
    }

    return {
      BlockStatement: checkNode,
      MustacheStatement: checkNode,
      SubExpression: checkNode,
    };
  }
}

'use strict';

const Rule = require('./base');
const createErrorMessage = require('../helpers/create-error-message');
const Scope = require('./internal/scope');

function message(original) {
  return `Ambiguous path '${original}' is not allowed. ` +
   `Use '@${original}' if it is a named argument ` +
   `or 'this.${original}' if it is a property on 'this'. ` +
   'If it is a helper or component that has no arguments ' +
   'you must manually add it to the \'strict-paths\' rule configuration, e.g. ' +
   `'strict-paths': { allow: ['${original}'] }.`;
}

function isString(value) {
  return typeof value === 'string';
}

// Allow Ember's builtin argless syntaxes
const ARGLESS_BUILTINS = [
  'debugger',
  'input',
  'outlet',
  'textarea',
  'yield',
];

module.exports = class StrictPaths extends Rule {
  parseConfig(config) {
    if (config === false || config === undefined) {
      return false;
    }

    switch (typeof config) {
    case 'undefined':
      return false;

    case 'boolean':
      if (config) {
        return {
          allow: ARGLESS_BUILTINS
        };
      } else {
        return false;
      }

    case 'object':
      if (Array.isArray(config.allow) && config.allow.every(isString)) {
        return {
          allow: ARGLESS_BUILTINS.concat(config.allow)
        };
      }
      break;
    }

    let errorMessage = createErrorMessage(this.ruleName, [
      '  * boolean - `true` to enable / `false` to disable',
      '  * object -- An object with the following keys:',
      '    * `allow` -- An array of component / helper names for that may be called without arguments',
    ], config);

    throw new Error(errorMessage);
  }

  // The way this visitor works is a bit sketchy. We need to lint the PathExpressions
  // in the callee position differently those in an argument position.
  //
  // Unfortunately, the current visitor API doesn't give us a good way to differentiate
  // these two cases. Instead, we rely on the fact that the _first_ PathExpression that
  // we enter after entering a MustacheStatement/BlockStatement/... will be the callee
  // and we track this using a flag called `nextPathIsCallee`.
  visitor() {
    let scope = new Scope();

    let nextPathIsCallee = false;

    return {
      PathExpression(path) {
        if (nextPathIsCallee) {
          // All paths are valid callees so there's nothing to check.
        } else {
          let valid = path.data ||
                      path.this ||
                      scope.isLocal(path.parts[0]) ||
                      this.config.allow.includes(path.original);


          if (!valid) {
            this.log({
              message: message(path.original),
              line: path.loc && path.loc.start.line,
              column: path.loc && path.loc.start.column,
              source: this.sourceForNode(path)
            });
          }
        }

        nextPathIsCallee = false;
      },

      SubExpression() {
        nextPathIsCallee = true;
      },

      ElementModifierStatement() {
        nextPathIsCallee = true;
      },

      MustacheStatement(node) {
        let isCall = node.params.length > 0 || node.hash.pairs.length > 0;

        nextPathIsCallee = isCall;
      },

      BlockStatement: {
        enter(node) {
          nextPathIsCallee = true;
          scope.pushFrame(node);
        },
        exit(node) {
          scope.popFrame(node);
        }
      }
    };
  }
};

module.exports.message = message;

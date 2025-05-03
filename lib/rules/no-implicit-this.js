import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

function message(original) {
  return (
    `Ambiguous path '${original}' is not allowed. ` +
    `Use '@${original}' if it is a named argument ` +
    `or 'this.${original}' if it is a property on 'this'. ` +
    'If it is a helper or component that has no arguments, ' +
    'you must either convert it to an angle bracket invocation ' +
    "or manually add it to the 'no-implicit-this' rule configuration, e.g. " +
    `'no-implicit-this': { allow: ['${original}'] }.`
  );
}

function isString(value) {
  return typeof value === 'string';
}

function isRegExp(value) {
  return value instanceof RegExp;
}

function allowedFormat(value) {
  return isString(value) || isRegExp(value);
}

// Allow Ember's builtin argless syntaxes
export const ARGLESS_BUILTIN_HELPERS = [
  'array',
  'concat',
  'debugger',
  'has-block',
  'hasBlock',
  'has-block-params',
  'hasBlockParams',
  'hash',
  'input',
  'log',
  'outlet',
  'query-params',
  'textarea',
  'yield',
  'unique-id',
];

// arg'less Components / Helpers in default ember-cli blueprint
const ARGLESS_DEFAULT_BLUEPRINT = [
  'welcome-page',
  /* from app/index.html and tests/index.html */
  'rootURL',
];

export default class NoImplicitThis extends Rule {
  parseConfig(config) {
    if (config === false || config === undefined || this.isStrictMode) {
      return false;
    }

    switch (typeof config) {
      case 'undefined': {
        return false;
      }

      case 'boolean': {
        if (config) {
          return {
            allow: [...ARGLESS_BUILTIN_HELPERS, ...ARGLESS_DEFAULT_BLUEPRINT],
          };
        } else {
          return false;
        }
      }

      case 'object': {
        if (Array.isArray(config.allow) && config.allow.every(allowedFormat)) {
          return {
            allow: [...ARGLESS_BUILTIN_HELPERS, ...ARGLESS_DEFAULT_BLUEPRINT, ...config.allow],
          };
        }
        break;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * object -- An object with the following keys:',
        '    * `allow` -- An array of component / helper names for that may be called without arguments',
      ],
      config
    );

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
    let nextPathIsCallee = false;

    return {
      PathExpression(path) {
        if (nextPathIsCallee) {
          // All paths are valid callees so there's nothing to check.
        } else {
          let valid =
            path.data ||
            path.this ||
            this.isLocal(path) ||
            this.config.allow.some((item) => {
              return isRegExp(item) ? item.test(path.original) : item === path.original;
            });

          if (!valid) {
            this.log({
              message: message(path.original),
              node: path,
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
        enter() {
          nextPathIsCallee = true;
        },
      },
    };
  }
}

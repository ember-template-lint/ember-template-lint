'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE = 'Invoke component directly instead of using `component` helper';

module.exports = class NoUnnecessaryComponentHelper extends Rule {
  static get meta() {
    return {
      description: 'disallows use of component template helper for known components',
      category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-unnecessary-component-helper.md',
      fixable: false,
    };
  }
  visitor() {
    let inSafeNamespace = false;
    const markAsSafeNamespace = {
      enter() {
        inSafeNamespace = true;
      },
      exit() {
        inSafeNamespace = false;
      },
    };

    function isComponentHelper(node) {
      return (
        AstNodeInfo.isPathExpression(node.path) &&
        node.path.original === 'component' &&
        node.params.length > 0
      );
    }

    function checkNode(node) {
      if (
        isComponentHelper(node) &&
        AstNodeInfo.isStringLiteral(node.params[0]) &&
        !node.params[0].value.includes('@') &&
        !inSafeNamespace
      ) {
        this.log({
          message: ERROR_MESSAGE,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
        });
      }
    }

    return {
      AttrNode: markAsSafeNamespace,
      BlockStatement: checkNode,
      MustacheStatement: checkNode,
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'Do not use `action` as %. Instead, use the `on` modifier and `fn` helper.';

module.exports = class NoAction extends Rule {
  static get meta() {
    return {
      description: 'disallows `{{action}}`',
      category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-action.md',
      fixable: false,
    };
  }
  visitor() {
    const isLocal = this.isLocal.bind(this);
    const log = this.log.bind(this);
    const sourceForNode = this.sourceForNode.bind(this);
    let closestTag = null;

    function detectAction(node, usageContext) {
      if (isLocal(node.path)) {
        return;
      }
      let maybeAction = node.path.original;
      if (node.path.type === 'StringLiteral') {
        return;
      }
      if (maybeAction !== 'action') {
        return;
      }
      if (node.path.data === true || node.path.this === true) {
        return;
      }
      log({
        message: ERROR_MESSAGE.replace('%', usageContext),
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: sourceForNode(node),
      });
    }

    return {
      SubExpression: node => {
        detectAction(node, '(action ...)');
      },
      MustacheStatement: node => {
        detectAction(node, '{{action ...}}');
      },
      ElementNode: node => {
        closestTag = node.tag;
      },
      ElementModifierStatement: node => {
        detectAction(node, `<${closestTag} {{action ...}} />`);
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE =
  'Do not use HTML element event properties like `onclick`. Instead, use the `on` modifier.';

module.exports = class NoElementEventActions extends Rule {
  static get meta() {
    return {
      description: 'disallows element event properties such as `onclick`',
      category: 'Possible Error', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-element-event-actions.md',
      fixable: false,
    };
  }
  visitor() {
    return {
      ElementNode(node) {
        const eventProperties = node.attributes.filter(isEventPropertyWithAction);
        eventProperties.forEach(eventProperty =>
          this.log({
            message: ERROR_MESSAGE,
            line: eventProperty.loc && eventProperty.loc.start.line,
            column: eventProperty.loc && eventProperty.loc.start.column,
            source: this.sourceForNode(eventProperty),
          })
        );
      },
    };
  }
};

function isDomEventAttributeName(name) {
  const nameLower = name.toLowerCase();
  return nameLower.startsWith('on') && nameLower !== 'on';
}

function isEventPropertyWithAction(node) {
  return (
    AstNodeInfo.isAttrNode(node) &&
    isDomEventAttributeName(node.name) &&
    AstNodeInfo.isMustacheStatement(node.value) &&
    AstNodeInfo.isPathExpression(node.value.path) &&
    node.value.path.original === 'action'
  );
}

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

'use strict';

const Rule = require('./_base');

const ERROR_MESSAGE =
  'Do not use HTML element event properties like `onclick`. Instead, use the `on` modifier.';

module.exports = class NoElementEventActions extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const eventProperties = node.attributes.filter(isEventPropertyWithAction);
        for (const eventProperty of eventProperties) {
          this.log({
            message: ERROR_MESSAGE,
            node: eventProperty,
          });
        }
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
    node.type === 'AttrNode' &&
    isDomEventAttributeName(node.name) &&
    node.value.type === 'MustacheStatement' &&
    node.value.path.type === 'PathExpression' &&
    node.value.path.original === 'action'
  );
}

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

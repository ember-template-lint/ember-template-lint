'use strict';

const Rule = require('./base');

const EVENT_HANDLER_METHODS = new Set([
  // Touch events
  'touchStart',
  'touchMove',
  'touchEnd',
  'touchCancel',

  // Keyboard events
  'keyDown',
  'keyUp',
  'keyPress',

  // Mouse events
  'mouseDown',
  'mouseUp',
  'contextMenu',
  'click',
  'doubleClick',
  'focusIn',
  'focusOut',

  // Form events
  'submit',
  'change',
  'focusIn',
  'focusOut',
  'input',

  // Drag and drop events
  'dragStart',
  'drag',
  'dragEnter',
  'dragLeave',
  'dragOver',
  'dragEnd',
  'drop',
]);

module.exports = class NoPassedInEventHandlers extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let { tag, attributes } = node;

        if (['Input', 'Textarea'].includes(tag)) {
          return;
        }

        for (let attribute of attributes) {
          let { name } = attribute;
          if (!name.startsWith('@')) {
            continue;
          }
          name = name.slice(1);

          if (EVENT_HANDLER_METHODS.has(name)) {
            this.log({
              message: makeErrorMessage(name),
              line: attribute.loc && attribute.loc.start.line,
              column: attribute.loc && attribute.loc.start.column,
              source: this.sourceForNode(attribute),
            });
          }
        }
      },

      MustacheStatement(node) {
        let { path, hash } = node;
        let { pairs } = hash;

        if (path.type === 'PathExpression' && ['input', 'textarea'].includes(path.original)) {
          return;
        }

        for (let pair of pairs) {
          let { key } = pair;

          if (EVENT_HANDLER_METHODS.has(key)) {
            this.log({
              message: makeErrorMessage(key),
              line: pair.loc && pair.loc.start.line,
              column: pair.loc && pair.loc.start.column,
              source: this.sourceForNode(pair),
            });
          }
        }
      },
    };
  }
};

function makeErrorMessage(eventHandler) {
  return `Event handler methods like \`${eventHandler}\` should not be passed in as a component arguments`;
}

module.exports.makeErrorMessage = makeErrorMessage;

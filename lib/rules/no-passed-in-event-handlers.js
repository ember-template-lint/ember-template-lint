'use strict';

const Rule = require('./base');

const EVENT_HANDLER_METHODS = [
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
];

module.exports = class NoPassedInEventHandlers extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        let { name } = node;
        if (!name.startsWith('@')) {
          return;
        }
        name = name.slice(1);

        if (EVENT_HANDLER_METHODS.includes(name)) {
          this.log({
            message: makeErrorMessage(name),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },

      MustacheStatement(node) {
        let { pairs } = node.hash;
        for (let pair of pairs) {
          let { key } = pair;

          if (EVENT_HANDLER_METHODS.includes(key)) {
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

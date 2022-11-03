import Rule from './_base.js';

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

const DEFAULT_CONFIG = {
  ignore: {},
};

function isValidConfigObjectFormat(config) {
  for (let key in config) {
    let ignores = config[key];
    let ignoresIsObject = typeof ignores === 'object';

    if (key === 'ignore' && ignoresIsObject) {
      for (let ignore in ignores) {
        let valueIsArray = Array.isArray(ignores[ignore]);

        if (!valueIsArray) {
          return false;
        }

        return !ignores[ignore].some((attributeName) => attributeName.startsWith('@'));
      }
    }
  }

  return true;
}

export default class NoPassedInEventHandlers extends Rule {
  parseConfig(config) {
    switch (typeof config) {
      case 'boolean': {
        return config ? DEFAULT_CONFIG : false;
      }
      case 'object': {
        return isValidConfigObjectFormat(config) ? config : false;
      }
      case 'undefined': {
        return false;
      }
    }
  }

  isIgnored(name, attributeName) {
    let ignoresForName = this.config.ignore[name];
    if (ignoresForName) {
      if (ignoresForName.includes(attributeName)) {
        return true;
      }
    }
    return false;
  }

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

          if (EVENT_HANDLER_METHODS.has(name) && !this.isIgnored(node.tag, name)) {
            this.log({
              message: makeErrorMessage(name),
              node: attribute,
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

          if (EVENT_HANDLER_METHODS.has(key) && !this.isIgnored(path.original, key)) {
            this.log({
              message: makeErrorMessage(key),
              node: pair,
            });
          }
        }
      },
    };
  }
}

function makeErrorMessage(eventHandler) {
  return `Event handler methods like \`${eventHandler}\` should not be passed in as a component arguments`;
}

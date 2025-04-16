import isAngleBracketComponent from '../helpers/is-angle-bracket-component.js';
import isInteractiveElement from '../helpers/is-interactive-element.js';
import parseConfig from '../helpers/parse-interactive-element-config.js';
import Rule from './_base.js';

const DISALLOWED_DOM_EVENTS = new Set([
  // Mouse events:
  'click',
  'dblclick',
  'mousedown',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseup',

  // Keyboard events:
  'keydown',
  'keypress',
  'keyup',

  // TODO: add any more relevant events.
]);

function isDisallowedDomEvent(name) {
  const nameLower = name.toLowerCase();
  return nameLower.startsWith('on') && DISALLOWED_DOM_EVENTS.has(name.slice(2));
}

export default class NoInvalidInteractive extends Rule {
  parseConfig(config) {
    return parseConfig(this.ruleName, config);
  }

  isCustomInteractiveElement(node) {
    let additionalInteractiveTags = this.config.additionalInteractiveTags || [];

    if (additionalInteractiveTags.includes(node.tag)) {
      return true;
    } else {
      return false;
    }
  }

  visitor() {
    this._element = null;

    const ignoredTags = this.config.ignoredTags || [];

    let visitor = {
      enter(node) {
        let isInteractive =
          isInteractiveElement(node) ||
          this.isCustomInteractiveElement(node) ||
          isAngleBracketComponent(this.scope, node);
        this._element = isInteractive ? null : node;
      },

      exit(node) {
        if (this._element === node) {
          this._element = null;
        }
      },
    };

    return {
      ElementModifierStatement(node) {
        if (!this._element) {
          return;
        }

        if (ignoredTags.includes(this._element.tag)) {
          return;
        }

        let modifierName = node.path.original;

        if (['action', 'on'].includes(modifierName)) {
          if (this._element.tag === 'img') {
            if (isSomeEventHandlersFor(node, ['error', 'load'])) {
              return;
            }
          }

          // Allow {{action "foo" on="reset"}} on form tags
          // Allow {{action "foo" on="submit"}} on form tags
          if (this._element.tag === 'form') {
            if (isSomeEventHandlersFor(node, ['submit', 'reset', 'change'])) {
              return;
            }
          }

          // Allow {{on "scroll" this.handleScroll}}
          if (modifierName === 'on') {
            let eventNameNode = node.params[0];
            if (
              eventNameNode &&
              eventNameNode.type === 'StringLiteral' &&
              !DISALLOWED_DOM_EVENTS.has(eventNameNode.value)
            ) {
              return;
            }
          }

          this.log({
            message: 'Interaction added to non-interactive element',
            node,
            source: this.sourceForNode(this._element),
          });
        }
      },

      AttrNode(node) {
        if (!this._element) {
          return;
        }

        if (ignoredTags.includes(this._element.tag)) {
          return;
        }

        if (node.value.type !== 'MustacheStatement') {
          return;
        }

        let helperName = node.value.path.original;

        //  Allow onreset={{action "foo"}}, onsubmit={{action "foo"}} on form tags
        if (
          this._element.tag === 'form' &&
          ['onchange', 'onreset', 'onsubmit'].includes(node.name)
        ) {
          return;
        }

        // Allow onerror={{action "foo"}} and onload={{action "foo"}} on any tag
        if (this._element.tag === 'img' && ['onerror', 'onload'].includes(node.name)) {
          return;
        }

        if (helperName === 'action') {
          this.log({
            message: 'Interaction added to non-interactive element',
            node,
            source: this.sourceForNode(this._element),
          });
        } else if (isDisallowedDomEvent(node.name)) {
          this.log({
            message: 'Interaction added to non-interactive element',
            node,
            source: this.sourceForNode(this._element),
          });
        }
      },

      ElementNode: visitor,
      ComponentNode: visitor,
    };
  }
}

function onModifierHasAction(node, name) {
  if (node.params.length === 0) {
    return false;
  }
  const param = node.params[0];
  if (param.type !== 'StringLiteral') {
    return false;
  }
  return param.original === name;
}

function actionModifierHasAction(node, name) {
  let hashPairs = node.hash.pairs || [];
  let i;
  let l = hashPairs.length;
  let hashItem;

  for (i = 0; i < l; i++) {
    hashItem = hashPairs[i];
    if (hashItem.key === 'on' && hashItem.value.value === name) {
      return true;
    }
  }

  return false;
}

function isSomeEventHandlersFor(node, names = []) {
  return names.some((name) => isEventHandlerFor(node, name));
}
function isEventHandlerFor(node, name) {
  if (node.path.original === 'on') {
    return onModifierHasAction(node, name);
  } else {
    return actionModifierHasAction(node, name);
  }
}

'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const isInteractiveElement = require('../helpers/is-interactive-element');
const Rule = require('./base');

const errorMessage = 'Static HTML elements with event handlers require a role.';

// const COMMON_INTERACTIVE_ROLES = [
//   'button',
//   'link',
//   'checkbox',
//   'menuitem',
//   'menuitemcheckbox',
//   'menuitemradio',
//   'option',
//   'radio',
//   'searchbox',
//   'switch',
//   'textbox',
// ];

// role || aria-

const handlers = ['onclick', 'onmousedown', 'onmouseup', 'onkeypress', 'onkeydown', 'onkeyup'];
const actionHandlers = ['click', 'mouseDown', 'mouseUp', 'keyPress', 'keyDown', 'keyUp'];

module.exports = class NoStaticElementInteractions extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (isInteractiveElement(node)) {
          return;
        }
        const ariaHidden = AstNodeInfo.hasAttribute(node, 'aria-hidden');
        if (ariaHidden) {
          return;
        }
        const attributeActionBindings = node.attributes.filter(attr =>
          handlers.includes(attr.name)
        );

        const actionModifiers = node.modifiers.filter(
          modifier =>
            modifier.type === 'ElementModifierStatement' && modifier.path.original === 'action'
        );
        const modifiersWithOn = actionModifiers.filter(modifier => {
          return (
            (modifier.hash.pairs || []).filter(pair => {
              return pair.key === 'on';
            }).length > 0
          );
        });
        const modifiersWithStringedOn = modifiersWithOn.filter(modifier => {
          return (
            (modifier.hash.pairs || []).filter(pair => {
              return (
                pair.value.type === 'StringLiteral' &&
                pair.key === 'on' &&
                actionHandlers.includes(pair.value.original)
              );
            }).length > 0
          );
        });
        const hasActionModifiersWithoutOn = actionModifiers.length !== modifiersWithOn.length;
        if (modifiersWithOn.length !== modifiersWithStringedOn.length) {
          // <div {{action 'foo-bar' on="click"}}  {{action 'foo-bar'}}></div>
          return;
        }
        if (
          !attributeActionBindings.length &&
          !modifiersWithOn.length &&
          !hasActionModifiersWithoutOn
        ) {
          return;
        }
        const hasAccessibleAttributes = node.attributes.some(
          attr => attr.name === 'role' || attr.name.indexOf('aria-') === 0
        );
        if (hasAccessibleAttributes) {
          return;
        }
        this.log({
          message: errorMessage,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
        });
      },
    };
  }
};

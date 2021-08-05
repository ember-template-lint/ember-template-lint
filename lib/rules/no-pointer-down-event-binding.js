'use strict';

const { match } = require('../helpers/node-matcher');
const Rule = require('./_base');

const ERROR_MESSAGE =
  'Avoid binding to a pointer `down` event; bind to a pointer `up` event instead';

/**
 * Detects that a Node is an instance of the `{{on}}` modifier with a known event that is being listened to
 *
 * @param {object} node
 * @return {boolean}
 */
function isOnModifier(node) {
  return match(node, { path: { original: 'on' }, params: [{ type: 'StringLiteral' }] });
}

/**
 * Detects that a Node is an instance of the `{{action}}` modifier
 *
 * @param {object} node
 * @return {boolean}
 */
function isActionModifer(node) {
  return match(node, { path: { original: 'action' } });
}

/**
 * Check if an event name is a pointer "down" event
 *
 * @param {string} eventName
 * @return {boolean}
 */
function isPointerDownEvent(eventName) {
  return ['mousedown', 'pointerdown'].includes(eventName.toLowerCase());
}

module.exports = class NoPointerDownEventBinding extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        if (node.name.startsWith('on') && isPointerDownEvent(node.name)) {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },

      ElementModifierStatement(node) {
        if (isOnModifier(node)) {
          const eventNameNode = node.params[0];

          if (isPointerDownEvent(eventNameNode.value)) {
            this.log({
              message: ERROR_MESSAGE,
              node: eventNameNode,
            });
          }
        }

        if (isActionModifer(node)) {
          const onHashPair = node.hash.pairs.find((hashPairNode) =>
            match(hashPairNode, { key: 'on' })
          );

          if (onHashPair && isPointerDownEvent(onHashPair.value.value)) {
            this.log({
              message: ERROR_MESSAGE,
              node: onHashPair.value,
            });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

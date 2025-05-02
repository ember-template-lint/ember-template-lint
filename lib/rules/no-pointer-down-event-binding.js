import { match } from '../helpers/node-matcher.js';
import Rule from './_base.js';

const POINTER_DOWN_EVENTS = new Set(['mousedown', 'onmousedown', 'pointerdown', 'onpointerdown']);
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
function isActionModifier(node) {
  return match(node, { path: { original: 'action' } });
}

/**
 * Check if an event name is a pointer "down" event
 *
 * @param {string} eventName
 * @return {boolean}
 */
function isPointerDownEvent(eventName) {
  return POINTER_DOWN_EVENTS.has(eventName.toLowerCase());
}

export default class NoPointerDownEventBinding extends Rule {
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

        if (isActionModifier(node)) {
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
}

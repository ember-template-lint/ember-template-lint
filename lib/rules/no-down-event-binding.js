'use strict';

const { match } = require('../helpers/node-matcher');
const Rule = require('./_base');

const ERROR_MESSAGE = 'Avoid binding to a `down` event; bind to an `up` event instead';

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
 * Check if an event name is a "down" event
 *
 * @param {string} eventName
 * @return {boolean}
 */
function isDownEvent(eventName) {
  return eventName.toLowerCase().endsWith('down');
}

module.exports = class NoDownEventBinding extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        if (node.name.startsWith('on') && isDownEvent(node.name)) {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },

      ElementModifierStatement(node) {
        if (isOnModifier(node)) {
          const eventNameNode = node.params[0];

          if (isDownEvent(eventNameNode.value)) {
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

          if (onHashPair && isDownEvent(onHashPair.value.value)) {
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

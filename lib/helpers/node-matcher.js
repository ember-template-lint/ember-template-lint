'use strict';

// Source: jscodeshift/src/matchNode.js
const hasOwn = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

function isNode(value) {
  return typeof value === 'object' && value !== null;
}

function matchNode(haystack, needle) {
  if (typeof needle === 'function') {
    return needle(haystack);
  }
  if (isNode(needle) && isNode(haystack)) {
    return Object.keys(needle).every(function (property) {
      return hasOwn(haystack, property) && matchNode(haystack[property], needle[property]);
    });
  }
  return haystack === needle;
}

// Source: jscodeshift/src/core.js
function matchOne(path, filter) {
  if (typeof path.get === 'function') {
    path = path.get();
  } else {
    path = { value: path };
  }
  return matchNode(path.value, filter);
}

/**
 * Utility function that pattern matches a test node against either:
 * - an individual reference node OR
 * - an Array of reference nodes
 *
 * An individual comparison returns whether or not the reference node is a
 * strict subset of the test node. Similarly, an Array comparison returns
 * whether or not any one of its individual reference node elements is a strict
 * subset of the test node.
 *
 * Useful for defining a given rule's 'target nodes' -- that is, the set of
 * nodes for which it is appropriate to apply the rule's logic. In this context,
 * the reference(s) can be used as selection criteria that a given visited node
 * (test node) must satisfy in order to proceed with rule logic execution.
 *
 * TODO: Add examples
 *
 * @param  {Node} testNode - the node to validate
 * @param  {Node|Node[]} ref - the reference node(s) to match testNode against
 * @return {boolean}
 */
function match(testNode, ref) {
  if (!testNode || !ref) {
    return;
  }
  if (Array.isArray(ref)) {
    return ref.some((refNode) => matchOne(testNode, refNode));
  } else {
    return matchOne(testNode, ref);
  }
}

module.exports.match = match;

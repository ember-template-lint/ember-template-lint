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
 * @param  {Node} testNode - the node to validate
 * @param  {Node|Node[]} ref - the reference node(s) to match testNode against
 * @return {boolean}
 *
 * For simple and specific target patterns, a `match` implementation has clearer
 * and more succinct syntax than its conditional (`if`) counterpart because it
 * does the following tasks on behalf of the rule:
 * - asserts the existence of relevant nodes, properties, values, etc.
 * - compounds the 'AND' logic dictated by a strict multi-comparison matching
 *
 * As an example, consider a rule designed to ensure that all `div` elements
 * with the custom `class` attribute `foo` also have a `role` attribute of
 * `textbox`. An outline of the rule might look like:
 *
 * Example Target:
 *  `<div class="foo"></div>`
 *
 * Example Code Context:
 *  visitor() {
 *    return ElementNode(node) {
 *      if (
 *        // check node against target here
 *      ) {
 *        // execute rule logic against target nodes here
 *      }
 *    }
 *  }
 *
 * An implementation using standard AST Node syntax might look like:
 *      if (
 *        node.tag === 'div' &&
 *        node.attributes &&
 *        node.attributes.find((attributeNode) =>
 *          attributeNode.name === 'class' &&
 *          attributeNode.value.chars === 'foo'
 *        ))
 *      )
 *
 * By comparison, the corresponding `match` implementation might look like:
 *      if (
 *        NodeMatcher.match(node, {
 *          tag: 'div',
 *          attributes: [ { name: 'class', value: { chars: 'foo' } } ]
 *        })
 *      )
 *
 * TODO: complex example (multiple supported types of `links`?)
 */
export function match(testNode, ref) {
  if (!testNode || !ref) {
    return;
  }
  if (Array.isArray(ref)) {
    return ref.some((refNode) => matchOne(testNode, refNode));
  } else {
    return matchOne(testNode, ref);
  }
}

export default {
  match,
};

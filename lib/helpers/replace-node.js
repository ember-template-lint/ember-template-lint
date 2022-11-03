/**
 * Autofixer helper for replacing one node with another.
 * @param {Node} node - node to replace
 * @param {Node} parentNode - parent node of node
 * @param {String} parentKey - parent key of node
 * @param {Node} newNode - new node to insert
 */
export default function replaceNode(node, parentNode, parentKey, newNode) {
  if (Array.isArray(parentNode[parentKey])) {
    let index = parentNode[parentKey].indexOf(node);
    parentNode[parentKey][index] = newNode;
  } else {
    parentNode[parentKey] = newNode;
  }
}

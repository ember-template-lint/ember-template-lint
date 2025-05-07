/**
 * Autofixer helper for replacing one node with another.
 * @param {import('ember-template-recast').AST.Node} node - node to replace
 * @param {import('ember-template-recast').AST.Node} parentNode - parent node of node
 * @param {string} parentKey - parent key of node
 * @param {import('ember-template-recast').AST.Node} newNode - new node to insert
 */
export default function replaceNode(node, parentNode, parentKey, newNode) {
  if (Array.isArray(parentNode[parentKey])) {
    let index = parentNode[parentKey].indexOf(node);
    parentNode[parentKey][index] = newNode;
  } else {
    parentNode[parentKey] = newNode;
  }
}

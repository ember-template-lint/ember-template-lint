'use strict';

function isConfigurationHtmlComment(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') === 0;
}

function isNonConfigurationHtmlComment(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') !== 0;
}

function isTextNode(node) {
  return node.type === 'TextNode';
}

function isElementNode(node) {
  return node && node.type === 'ElementNode';
}

function isComponentNode(node) {
  return node && node.type === 'ComponentNode';
}

function isBlockStatement(node) {
  return node.type === 'BlockStatement';
}

function hasAttribute(node, attributeName) {

  var attribute = findAttribute(node, attributeName);

  return !!attribute;
}

function findAttribute(node, attributeName) {
  for (var i = 0; i < node.attributes.length; i++) {
    var attribute = node.attributes[i];

    if (attribute.name === attributeName) {
      return attribute;
    }
  }
}

module.exports = {
  isConfigurationHtmlComment: isConfigurationHtmlComment,
  isNonConfigurationHtmlComment: isNonConfigurationHtmlComment,
  isTextNode: isTextNode,
  isElementNode: isElementNode,
  isComponentNode: isComponentNode,
  isBlockStatement: isBlockStatement,
  hasAttribute: hasAttribute,
  findAttribute: findAttribute
};

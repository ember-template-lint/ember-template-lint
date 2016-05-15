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
  return node.type === 'ElementNode';
}

function isBlockStatement(node) {
  return node.type === 'BlockStatement';
}

module.exports = {
  isConfigurationHtmlComment: isConfigurationHtmlComment,
  isNonConfigurationHtmlComment: isNonConfigurationHtmlComment,
  isTextNode: isTextNode,
  isElementNode: isElementNode,
  isBlockStatement: isBlockStatement
};

'use strict';

function AstNodeInfo() {}

AstNodeInfo.isConfigurationHtmlComment = function(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') === 0;
};

AstNodeInfo.isNonConfigurationHtmlComment = function(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') !== 0;
};

AstNodeInfo.isTextNode = function(node) {
  return node.type === 'TextNode';
};

AstNodeInfo.isElementNode = function(node) {
  return node.type === 'ElementNode';
};

AstNodeInfo.isBlockStatement = function(node) {
  return node.type === 'BlockStatement';
};

module.exports = AstNodeInfo;

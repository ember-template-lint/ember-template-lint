'use strict';

function AstNodeInfo() {}

AstNodeInfo.isConfigurationHtmlComment = function(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') === 0;
};

AstNodeInfo.isNonConfigurationHtmlComment = function(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') !== 0;
};

module.exports = AstNodeInfo;

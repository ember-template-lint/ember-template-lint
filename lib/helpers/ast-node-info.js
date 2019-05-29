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

function isAttrNode(node) {
  return node.type === 'AttrNode';
}

function isCommentStatement(node) {
  return node.type === 'CommentStatement';
}

function isConcatStatement(node) {
  return node.type === 'ConcatStatement';
}

function isMustacheCommentStatement(node) {
  return node.type === 'MustacheCommentStatement';
}

function isPathExpression(node) {
  return node.type === 'PathExpression';
}

function isSubExpression(node) {
  return node.type === 'SubExpression';
}

function isElementNode(node) {
  return node && node.type === 'ElementNode';
}

function isComponentNode(node) {
  return node && node.type === 'ComponentNode';
}

function isMustacheStatement(node) {
  return node.type === 'MustacheStatement';
}

function isBlockStatement(node) {
  return node.type === 'BlockStatement';
}

function isIf(node) {
  return node.path && node.path.original === 'if';
}

function isUnless(node) {
  return node.path && node.path.original === 'unless';
}

function hasAttribute(node, attributeName) {
  var attribute = findAttribute(node, attributeName);
  return !!attribute;
}

function hasAttributeValue(node, attributeName, nodeAttributeValue) {
  const attributeNode = findAttribute(node, attributeName);
  if (!attributeNode) {
    return false;
  }
  return attributeValue(attributeNode) === nodeAttributeValue;
}

function elementAttributeValue(node, attributeName) {
  return attributeValue(findAttribute(node, attributeName));
}

function hasAnyAttribute(node, attributeNames) {
  return attributeNames.map(name => hasAttribute(node, name)).some(exists => exists === true);
}

function attributeValue(attrNode) {
  if (!attrNode) {
    return;
  }
  if (attrNode.value && attrNode.value.type === 'TextNode') {
    return attrNode.value.chars;
  } else {
    return attrNode.value;
  }
}

function findAttribute(node, attributeName) {
  if (!node.attributes || !node.attributes.length) {
    return;
  }
  for (var i = 0; i < node.attributes.length; i++) {
    var attribute = node.attributes[i];

    if (attribute.name === attributeName) {
      return attribute;
    }
  }
}

function isInputElement(node) {
  return node.tag === 'input';
}

function isImgElement(node) {
  return node.tag === 'img';
}

function isLinkElement(node) {
  return node.tag === 'a';
}

function isObjectElement(node) {
  return node.tag === 'object';
}

function isAreaElement(node) {
  return node.tag === 'area';
}

function childrenFor(node) {
  if (node.type === 'Program') {
    return node.body;
  }
  if (node.type === 'BlockStatement') {
    if (node.inverse) {
      return node.program.body.concat(node.inverse.body);
    }
    return node.program.body;
  }
  if (node.type === 'ElementNode') {
    return node.children;
  }
}

function hasChildren(node) {
  var children = childrenFor(node);
  return !!(children && children.length);
}

module.exports = {
  childrenFor: childrenFor,
  findAttribute: findAttribute,
  hasAttribute: hasAttribute,
  hasChildren: hasChildren,
  hasAnyAttribute: hasAnyAttribute,
  hasAttributeValue: hasAttributeValue,
  attributeValue: attributeValue,
  elementAttributeValue: elementAttributeValue,
  isBlockStatement: isBlockStatement,
  isIf: isIf,
  isUnless: isUnless,
  isCommentStatement: isCommentStatement,
  isConcatStatement: isConcatStatement,
  isMustacheCommentStatement: isMustacheCommentStatement,
  isPathExpression: isPathExpression,
  isSubExpression: isSubExpression,
  isComponentNode: isComponentNode,
  isConfigurationHtmlComment: isConfigurationHtmlComment,
  isElementNode: isElementNode,
  isInputElement: isInputElement,
  isObjectElement: isObjectElement,
  isAreaElement: isAreaElement,
  isImgElement: isImgElement,
  isLinkElement: isLinkElement,
  isMustacheStatement: isMustacheStatement,
  isNonConfigurationHtmlComment: isNonConfigurationHtmlComment,
  isTextNode: isTextNode,
  isAttrNode: isAttrNode,
};

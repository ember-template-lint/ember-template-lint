function isConfigurationHtmlComment(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') === 0;
}

function isNonConfigurationHtmlComment(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') !== 0;
}

function isIf(node) {
  return node.path && node.path.original === 'if';
}

function isUnless(node) {
  return node.path && node.path.original === 'unless';
}

function isEach(node) {
  return node.path && node.path.original === 'each';
}

function isEachIn(node) {
  return node.path && node.path.original === 'each-in';
}

function isLet(node) {
  return node.path && node.path.original === 'let';
}

function isWith(node) {
  return node.path && node.path.original === 'with';
}

function isControlFlowHelper(node) {
  return (
    isIf(node) || isUnless(node) || isEach(node) || isEachIn(node) || isLet(node) || isWith(node)
  );
}

function hasAttribute(node, attributeName) {
  let attribute = findAttribute(node, attributeName);
  return Boolean(attribute);
}

function hasAnyAttribute(node, attributeNames) {
  return attributeNames.map((name) => hasAttribute(node, name)).includes(true);
}

function findAttribute(node, attributeName) {
  if (!node.attributes || !node.attributes.length) {
    return;
  }
  for (let i = 0; i < node.attributes.length; i++) {
    let attribute = node.attributes[i];

    if (attribute.name === attributeName) {
      return attribute;
    }
  }
}

function childrenFor(node) {
  if (node.type === 'Program' || node.type === 'Block' || node.type === 'Template') {
    return node.body;
  }
  if (node.type === 'BlockStatement') {
    if (node.inverse) {
      return [...node.program.body, ...node.inverse.body];
    }
    return node.program.body;
  }
  if (node.type === 'ElementNode') {
    return node.children;
  }
}

function hasChildren(node) {
  let children = childrenFor(node);
  return Boolean(children && children.length);
}

function attributeTextValue(node) {
  if (!node) {
    return;
  }
  if (node.value && node.value.type === 'TextNode') {
    return node.value.chars;
  }
}

export default {
  attributeTextValue,
  childrenFor,
  findAttribute,
  hasAttribute,
  hasChildren,
  hasAnyAttribute,
  isIf,
  isUnless,
  isEach,
  isEachIn,
  isLet,
  isWith,
  isControlFlowHelper,
  isConfigurationHtmlComment,
  isNonConfigurationHtmlComment,
};

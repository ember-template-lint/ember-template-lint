/**
 *
 * @param {import('ember-template-recast').AST.CommentStatement} node
 * @returns {boolean}
 */
function isConfigurationHtmlComment(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') === 0;
}
/**
 *
 * @param {import('ember-template-recast').AST.CommentStatement} node
 * @returns {boolean}
 */
function isNonConfigurationHtmlComment(node) {
  return node.type === 'CommentStatement' && node.value.trim().indexOf('template-lint ') !== 0;
}
/**
 *
 * @param {import('ember-template-recast').AST.MustacheStatement | import('ember-template-recast').AST.BlockStatement | import('ember-template-recast').AST.SubExpression} node
 * @returns {boolean}
 */
function isIf(node) {
  return node.path && node.path.original === 'if';
}
/**
 *
 * @param {import('ember-template-recast').AST.MustacheStatement | import('ember-template-recast').AST.BlockStatement | import('ember-template-recast').AST.SubExpression} node
 * @returns {boolean}
 */
function isUnless(node) {
  return node.path && node.path.original === 'unless';
}
/**
 *
 * @param {import('ember-template-recast').AST.MustacheStatement | import('ember-template-recast').AST.BlockStatement | import('ember-template-recast').AST.SubExpression} node
 * @returns {boolean}
 */
function isEach(node) {
  return node.path && node.path.original === 'each';
}
/**
 *
 * @param {import('ember-template-recast').AST.MustacheStatement | import('ember-template-recast').AST.BlockStatement | import('ember-template-recast').AST.SubExpression} node
 * @returns {boolean}
 */
function isEachIn(node) {
  return node.path && node.path.original === 'each-in';
}
/**
 *
 * @param {import('ember-template-recast').AST.MustacheStatement | import('ember-template-recast').AST.BlockStatement | import('ember-template-recast').AST.SubExpression} node
 * @returns {boolean}
 */
function isLet(node) {
  return node.path && node.path.original === 'let';
}
/**
 *
 * @param {import('ember-template-recast').AST.MustacheStatement | import('ember-template-recast').AST.BlockStatement | import('ember-template-recast').AST.SubExpression} node
 * @returns {boolean}
 */
function isWith(node) {
  return node.path && node.path.original === 'with';
}
/**
 *
 * @param {import('ember-template-recast').AST.MustacheStatement | import('ember-template-recast').AST.BlockStatement | import('ember-template-recast').AST.SubExpression} node
 * @returns {boolean}
 */
function isControlFlowHelper(node) {
  return (
    isIf(node) || isUnless(node) || isEach(node) || isEachIn(node) || isLet(node) || isWith(node)
  );
}

/**
 *
 * @param {import('ember-template-recast').AST.ElementNode} node
 * @param {string} attributeName
 * @returns
 */
function hasAttribute(node, attributeName) {
  let attribute = findAttribute(node, attributeName);
  return Boolean(attribute);
}

/**
 *
 * @param {import('ember-template-recast').AST.ElementNode} node
 * @param {Array<string>} attributeNames
 * @returns
 */
function hasAnyAttribute(node, attributeNames) {
  return attributeNames.map((name) => hasAttribute(node, name)).includes(true);
}

/**
 *
 * @param {import('ember-template-recast').AST.ElementNode} node
 * @param {string} attributeName
 * @returns {import('ember-template-recast').AST.AttrNode | undefined}
 */
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

/**
 *
 * @param {import('ember-template-recast').AST.Node} node
 * @returns {Array<import('ember-template-recast').AST.Node>}
 */
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

/**
 *
 * @param {import('ember-template-recast').AST.Node} node
 * @returns {boolean}
 */
function hasChildren(node) {
  let children = childrenFor(node);
  return Boolean(children && children.length);
}

/**
 *
 * @param {import('ember-template-recast').AST.AttrNode} node
 * @returns {string | undefined}
 */
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

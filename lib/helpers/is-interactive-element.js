'use strict';

var ast = require('./ast-node-info');

var INTERACTIVE_TAG_NAMES = [
  'button',
  'details',
  'embed',
  'iframe',
  'input',
  'keygen',
  'label',
  'select',
  'textarea'
];

function isHyperLink(node) {
  return node.tag === 'a' && ast.hasAttribute(node, 'href');
}

function isHiddenInput(node) {
  if (node.tag !== 'input') { return false; }

  var type = ast.findAttribute(node, 'type');
  if (type && type.value && type.value.chars === 'hidden') {
    return true;
  }

  return false;
}

/*
 Spec: https://html.spec.whatwg.org/multipage/dom.html#interactive-content-2

 `<label>` was omitted due to the ability nesting a label with an input tag.
 `<audio>` and `<video>` also omitted because use legacy browser support
 there is a need to use it nested with `<object>` and `<a>`
 */
function reason(node) {
  if (!ast.isElementNode(node) && !ast.isComponentNode(node)) {
    return null;
  }

  if (isHiddenInput(node)) {
    return null;
  }

  if (INTERACTIVE_TAG_NAMES.indexOf(node.tag) > -1) {
    return '<' + node.tag + '>';
  }

  if (isHyperLink(node)) {
    return 'an <a> element with the `href` attribute';
  }

  if (ast.hasAttribute(node, 'tabindex')) {
    return 'an element with the `tabindex` attribute';
  }

  if ((node.tag === 'img' || node.tag === 'object') && ast.hasAttribute(node, 'usemap')) {
    return 'an <' + node.tag + '> element with the `usemap` attribute';
  }

  return null;
}

module.exports = function isInteractive(node)  {
  return reason(node) !== null;
};

module.exports.reason = reason;

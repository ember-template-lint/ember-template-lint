'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

const DISALLOWED_LINK_TEXT = new Set([
  // WCAG F84-Provided Examples
  'click here',
  'more info',
  'read more',
  'more',
  '',
]);

function getTrimmedText(text) {
  const nbspRemoved = text.replace(/&nbsp;/g, ' ');
  return nbspRemoved.toLowerCase().trim();
}

function isHidden(element) {
  const ariaHiddenAttr = AstNodeInfo.findAttribute(element, 'aria-hidden');

  return (
    (ariaHiddenAttr && ariaHiddenAttr.value.chars === 'true') ||
    AstNodeInfo.hasAttribute(element, 'hidden')
  );
}

function hasValidAriaLabel(node) {
  const ariaLabelledbyAttr = AstNodeInfo.findAttribute(node, 'aria-labelledby');

  if (ariaLabelledbyAttr) {
    return ariaLabelledbyAttr.value.chars.length > 0;
  }

  const ariaLabelAttr = AstNodeInfo.findAttribute(node, 'aria-label');

  if (ariaLabelAttr) {
    let ariaLabel = getTrimmedText(ariaLabelAttr.value.chars);
    return !DISALLOWED_LINK_TEXT.has(ariaLabel);
  }
}

function hasInvalidLinkText(node) {
  // Extract the text content(s) from the TextNode child(ren)
  const nodeChildren = AstNodeInfo.childrenFor(node);
  const textChildren = nodeChildren.filter((child) => child.type === 'TextNode');

  if (isHidden(node) || hasValidAriaLabel(node)) {
    return;
  }

  if (!nodeChildren.length) {
    return true;
  }

  if (nodeChildren.length !== textChildren.length) {
    // do not flag an error when the link contains additional dynamic (non-text) children
    return;
  }

  const linkTexts = textChildren.map((linkText) => getTrimmedText(linkText.chars));

  // Check to see if the text content is too `generic` by checking it against
  // the reference list (array, above) of `disallowed` link text Strings/phrases
  const hasGenericLinkTexts = linkTexts.some((linkText) => DISALLOWED_LINK_TEXT.has(linkText));
  return hasGenericLinkTexts;
}

module.exports = class NoInvalidLinkText extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'a' || node.tag === 'LinkTo') {
          // Report if one or more child TextNode element(s) is on the disallowed list
          if (hasInvalidLinkText(node)) {
            this.log({
              message: 'Links should have descriptive text',
              node,
            });
          }
        }
      },
      BlockStatement(node) {
        if (node.path.original === 'link-to') {
          // Report if one or more child TextNode element(s) is on the disallowed list
          if (hasInvalidLinkText(node)) {
            this.log({
              message: 'Links should have descriptive text',
              node,
            });
          }
        }
      },
    };
  }
};

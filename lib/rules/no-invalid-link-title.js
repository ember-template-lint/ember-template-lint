'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

function hasInvalidLinkTitle(node) {
  const hasTitleAttribute = AstNodeInfo.hasAttribute(node, 'title');
  // If it doesn't have a title attribute then don't even worry about it
  if (!hasTitleAttribute) {
    return;
  }
  // Extract the text content(s) from the TextNode child(ren)
  const nodeChildren = AstNodeInfo.childrenFor(node);
  const textChildren = nodeChildren.filter(child => AstNodeInfo.isTextNode(child));
  const linkTexts = textChildren.map(linkText => linkText['chars'].toLowerCase().trim());

  const titleAttributeValue = AstNodeInfo.elementAttributeValue(node, 'title')
    .toLowerCase()
    .trim();
  // Check to see if the text content is the same as the title attribute value
  const hasMatchingLinkAndTitleText = linkTexts.some(linkText =>
    titleAttributeValue.includes(linkText)
  );
  return hasMatchingLinkAndTitleText;
}

module.exports = class NoInvalidLinkTitle extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'a' || node.tag === 'LinkTo') {
          if (hasInvalidLinkTitle(node)) {
            this.log({
              message: 'Title attribute values should not be the same as the link text.',
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }
      },
      BlockStatement(node) {
        if (node.path.original === 'link-to') {
          if (hasInvalidLinkTitle(node)) {
            this.log({
              message: 'Title attribute values should not be the same as the link text.',
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }
      },
    };
  }
};

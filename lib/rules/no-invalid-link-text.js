'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const DISALLOWED_LINK_TEXT = new Set([
  // WCAG F84-Provided Examples
  'click here',
  'more info',
  'read more',
  'more',
]);

function hasInvalidLinkText(node) {
  // Extract the text content(s) from the TextNode child(ren)
  const nodeChildren = AstNodeInfo.childrenFor(node);
  const textChildren = nodeChildren.filter((child) => AstNodeInfo.isTextNode(child));

  if (nodeChildren.length !== textChildren.length) {
    // do not flag an error when the link contains additional dynamic (non-text) children
    return;
  }
  const linkTexts = textChildren.map((linkText) => linkText['chars'].toLowerCase().trim());

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
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
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

'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const DISALLOWED_LINK_TEXT = [
  // WCAG F84-Provided Examples
  'click here',
  'more info',
  'read more',
  'more',
];
module.exports = class NoInvalidLinkText extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag !== 'a') {
          return;
        }
        if (AstNodeInfo.isLinkElement(node)) {
          // Extract the text content(s) from the TextNode child(ren)
          const nodeChildren = AstNodeInfo.childrenFor(node);
          const textChildren = nodeChildren.filter(child => AstNodeInfo.isTextNode(child));
          const linkTexts = textChildren.map(linkText => linkText['chars'].toLowerCase().trim());

          // Check to see if the text content is too `generic` by checking it against
          // the reference list (array, above) of `disallowed` link text Strings/phrases
          const genericLinkTexts = linkTexts.filter(linkText =>
            DISALLOWED_LINK_TEXT.includes(linkText)
          );
          // Report if one or more child TextNode element(s) is on the disallowed list
          if (genericLinkTexts.length > 0) {
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

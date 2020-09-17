'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

function hasInvalidLinkTitle(node, titleAttributeValues) {
  // Extract the text content(s) from the TextNode child(ren)
  const nodeChildren = AstNodeInfo.childrenFor(node);
  const textChildren = nodeChildren.filter((child) => AstNodeInfo.isTextNode(child));
  const linkTexts = textChildren.map((linkText) => linkText.chars.toLowerCase().trim());

  // Check to see if the text content is the same as the title attribute value
  const hasMatchingLinkAndTitleText = linkTexts.some((linkText) =>
    titleAttributeValues.some((titleValue) => titleValue.includes(linkText))
  );

  return hasMatchingLinkAndTitleText;
}

module.exports = class NoInvalidLinkTitle extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'a' || node.tag === 'LinkTo') {
          let titleValues = [
            AstNodeInfo.elementAttributeValue(node, 'title'),
            node.tag === 'LinkTo' && AstNodeInfo.elementAttributeValue(node, '@title'),
          ]
            .filter((possibleValue) => typeof possibleValue === 'string')
            .map((value) => value.toLowerCase().trim());

          if (titleValues.length > 1) {
            this.log({
              message:
                'Specifying title as both an attribute and an argument to <LinkTo /> is invalid.',
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }

          if (hasInvalidLinkTitle(node, titleValues)) {
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
          let titleHashArg = node.hash.pairs.find((pair) => pair.key === 'title');
          if (titleHashArg && titleHashArg.value.type === 'StringLiteral') {
            let titleValue = titleHashArg.value.value.toLowerCase().trim();

            if (hasInvalidLinkTitle(node, [titleValue])) {
              this.log({
                message: 'Title attribute values should not be the same as the link text.',
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node),
              });
            }
          }
        }
      },
    };
  }
};

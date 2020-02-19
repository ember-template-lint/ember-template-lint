'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

module.exports = class NoInvalidLinkTitle extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'a' || node.tag === 'LinkTo') {
          // Extract the text content(s) from the TextNode child(ren)
          let nodeChildren = AstNodeInfo.childrenFor(node);
          let textChildren = nodeChildren.filter(child => AstNodeInfo.isTextNode(child));
          let linkTexts = textChildren.map(linkText => linkText['chars'].toLowerCase().trim());
          let hasTitleAttribute = AstNodeInfo.hasAttribute(node, 'title');
          if (!hasTitleAttribute) {
            return;
          }
          let titleAttributeValue = AstNodeInfo.elementAttributeValue(node, 'title')
            .toLowerCase()
            .trim();
          if (linkTexts.includes(titleAttributeValue)) {
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

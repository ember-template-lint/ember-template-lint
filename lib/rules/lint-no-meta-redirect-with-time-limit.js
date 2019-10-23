'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

module.exports = class noMetaRedirectWithTimeLimit extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
    });
  }
  visitor() {
    return {
      ElementNode(node) {
        if (AstNodeInfo.hasAttribute(node, 'hidden')) {
          return;
        }

        if (AstNodeInfo.hasAttributeValue(node, 'aria-hidden', 'true')) {
          return;
        }

        const isMeta = AstNodeInfo.isElementNode(node, 'meta');
        const hasMetaRedirect = AstNodeInfo.hasAttribute(node, 'http-equiv');

        if (isMeta && hasMetaRedirect) {
          const contentAttr = AstNodeInfo.hasAttribute(node, 'content');
          const contentAttrValue = AstNodeInfo.elementAttributeValue(node, 'content');
          if (contentAttr) {
            if (contentAttrValue.charAt(0) > 0) {
              this.log({
                message: 'a meta redirect should not have a delay value greater than zero',
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

'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

module.exports = class NoMetaRedirectWithTimeLimit extends Rule {
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
        const isMeta = node.tag === 'meta';
        const hasMetaRedirect = AstNodeInfo.hasAttribute(node, 'http-equiv');

        if (isMeta && hasMetaRedirect) {
          const contentAttr = AstNodeInfo.hasAttribute(node, 'content');
          const contentAttrValue = AstNodeInfo.elementAttributeValue(node, 'content');
          if (contentAttr) {
            // since the content attribute will have both the delay (in seconds) and the new URL, we only need to check the first character in the value string.
            if (contentAttrValue.charAt(0) !== '0') {
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

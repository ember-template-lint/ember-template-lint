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
            // if there is a semicolon, it is a REDIRECT and should not have a delay value greater than zero
            if (contentAttrValue.includes(';')) {
              if (contentAttrValue.charAt(0) !== '0') {
                this.log({
                  message: 'a meta redirect should not have a delay value greater than zero',
                  line: node.loc && node.loc.start.line,
                  column: node.loc && node.loc.start.column,
                  source: this.sourceForNode(node),
                });
              }
            } else {
              // if there is not a semicolon, it is a REFRESH and should have a delay greater than 72000 seconds
              // eslint-disable-next-line radix
              if (parseInt(contentAttrValue) <= 72000) {
                this.log({
                  message: 'a meta refresh should have a delay greater than 72000 seconds',
                  line: node.loc && node.loc.start.line,
                  column: node.loc && node.loc.start.column,
                  source: this.sourceForNode(node),
                });
              }
            }
          }
        }
      },
    };
  }
};

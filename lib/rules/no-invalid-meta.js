'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

module.exports = class NoInvalidMeta extends Rule {
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
        const contentAttr = AstNodeInfo.hasAttribute(node, 'content');
        const contentAttrValue = AstNodeInfo.elementAttributeValue(node, 'content');
        if (isMeta && hasMetaRedirect) {
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
        // Looks for spaces because Apple allowed spaces in their spec.
        let userScalableRegExp = /user-scalable(\s*?)=(\s*?)no/gim;
        if (contentAttrValue.match(userScalableRegExp)) {
          this.log({
            message: 'a meta viewport should not restrict user-scalable',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
        if (contentAttrValue.includes('maximum-scale')) {
          this.log({
            message: 'a meta viewport should not set a maximum scale on content',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

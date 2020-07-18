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
      // eslint-disable-next-line complexity
      ElementNode(node) {
        if (node.tag !== 'meta') {
          return;
        }

        const hasHttpEquiv = AstNodeInfo.hasAttribute(node, 'http-equiv');
        const hasContent = AstNodeInfo.hasAttribute(node, 'content');
        const hasName = AstNodeInfo.hasAttribute(node, 'name');
        const hasProperty = AstNodeInfo.hasAttribute(node, 'property');
        const hasNameOrProperty = hasName || hasProperty;

        const contentAttrValue = AstNodeInfo.elementAttributeValue(node, 'content');

        if ((hasNameOrProperty || hasHttpEquiv) && !hasContent) {
          this.log({
            message:
              'a meta content attribute must be defined if the name, property or the http-equiv attribute is defined',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        } else if (hasContent && !hasNameOrProperty && !hasHttpEquiv) {
          this.log({
            message:
              'a meta content attribute cannot be defined if the name, property nor the http-equiv attributes are defined',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }

        if (hasContent && typeof contentAttrValue === 'string') {
          if (hasHttpEquiv) {
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
              if (Number.parseInt(contentAttrValue) <= 72000) {
                this.log({
                  message: 'a meta refresh should have a delay greater than 72000 seconds',
                  line: node.loc && node.loc.start.line,
                  column: node.loc && node.loc.start.column,
                  source: this.sourceForNode(node),
                });
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
        }
      },
    };
  }
};

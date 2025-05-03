import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

export default class NoInvalidMeta extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      node,
    });
  }
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag !== 'meta') {
          return;
        }

        const hasHttpEquiv = AstNodeInfo.hasAttribute(node, 'http-equiv');
        const hasContent = AstNodeInfo.hasAttribute(node, 'content');
        const hasName = AstNodeInfo.hasAttribute(node, 'name');
        const hasProperty = AstNodeInfo.hasAttribute(node, 'property');
        const hasItemprop = AstNodeInfo.hasAttribute(node, 'itemprop');
        const hasIdentifier = hasName || hasProperty || hasItemprop;

        let contentAttr, contentAttrValue;
        if (hasContent) {
          contentAttr = AstNodeInfo.findAttribute(node, 'content');
          if (contentAttr.value.type === 'TextNode') {
            contentAttrValue = contentAttr.value.chars;
          }
        }

        if ((hasIdentifier || hasHttpEquiv) && !hasContent) {
          this.log({
            message:
              'a meta content attribute must be defined if the name, property, itemprop or the http-equiv attribute is defined',
            node,
          });
        } else if (hasContent && !hasIdentifier && !hasHttpEquiv) {
          this.log({
            message:
              'a meta content attribute cannot be defined if the name, property, itemprop nor the http-equiv attributes are defined',
            node,
          });
        }

        if (hasContent && typeof contentAttrValue === 'string') {
          if (hasHttpEquiv) {
            // if there is a semicolon, it is a REDIRECT and should not have a delay value greater than zero
            if (contentAttrValue.includes(';')) {
              if (contentAttrValue.charAt(0) !== '0') {
                this.log({
                  message: 'a meta redirect should not have a delay value greater than zero',
                  node,
                });
              }
            } else {
              // eslint-disable-next-line radix
              if (Number.parseInt(contentAttrValue) <= 72_000) {
                this.log({
                  message: 'a meta refresh should have a delay greater than 72000 seconds',
                  node,
                });
              }
            }
          }

          // Looks for spaces because Apple allowed spaces in their spec.
          let userScalableRegExp = /user-scalable(\s*?)=(\s*?)no/gim;
          if (userScalableRegExp.test(contentAttrValue)) {
            this.log({
              message: 'a meta viewport should not restrict user-scalable',
              node,
            });
          }

          if (contentAttrValue.includes('maximum-scale')) {
            this.log({
              message: 'a meta viewport should not set a maximum scale on content',
              node,
            });
          }
        }
      },
    };
  }
}

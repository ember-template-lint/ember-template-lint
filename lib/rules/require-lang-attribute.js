'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const ERROR_MESSAGE = 'The `<html>` element must have the `lang` attribute with a non-null value';

module.exports = class RequireLangAttribute extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'html' && !AstNodeInfo.hasAttribute(node, 'lang')) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
        const hasLangAttribute = AstNodeInfo.hasAttribute(node, 'lang');
        let langAttrNode, langAttributeValue;
        if (hasLangAttribute) {
          langAttrNode = AstNodeInfo.findAttribute(node, 'lang');
          if (langAttrNode.value.type === 'TextNode') {
            langAttributeValue = langAttrNode.value.chars;
          } else {
            langAttributeValue = langAttrNode.value;
          }
        }

        if (node.tag === 'html' && hasLangAttribute && !langAttributeValue) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

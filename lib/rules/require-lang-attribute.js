import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const ERROR_MESSAGE = 'The `<html>` element must have the `lang` attribute with a non-null value';

export default class RequireLangAttribute extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'html' && !AstNodeInfo.hasAttribute(node, 'lang')) {
          this.log({
            message: ERROR_MESSAGE,
            node,
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
            node,
          });
        }
      },
    };
  }
}

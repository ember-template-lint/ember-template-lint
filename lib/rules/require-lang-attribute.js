import tags from 'language-tags';

import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const ERROR_MESSAGE = 'The `<html>` element must have the `lang` attribute with a valid value';

function hasValidValue(langAttrNode) {
  if (langAttrNode.value.type === 'TextNode') {
    return tags.check(langAttrNode.value.chars);
  } else {
    return langAttrNode.value !== undefined;
  }
}

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
        let langAttrNode;
        if (hasLangAttribute) {
          langAttrNode = AstNodeInfo.findAttribute(node, 'lang');
        }
        if (node.tag === 'html' && hasLangAttribute && !hasValidValue(langAttrNode)) {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
}

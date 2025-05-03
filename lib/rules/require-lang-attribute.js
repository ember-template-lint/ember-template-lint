import tags from 'language-tags';

import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const DEFAULT_CONFIG = {
  validateValues: true,
};

const ERROR_MESSAGE = 'The `<html>` element must have the `lang` attribute with a valid value';

function hasValue(langAttrNode) {
  let langAttributeValue;
  if (langAttrNode.value.type === 'TextNode') {
    langAttributeValue = langAttrNode.value.chars;
  } else {
    langAttributeValue = langAttrNode.value;
  }
  return langAttributeValue;
}

function hasValidValue(langAttrNode) {
  if (langAttrNode.value.type === 'TextNode') {
    return tags.check(langAttrNode.value.chars);
  } else {
    return langAttrNode.value !== undefined;
  }
}

export default class RequireLangAttribute extends Rule {
  parseConfig(config) {
    return parseConfig(config);
  }

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
        if (node.tag === 'html' && hasLangAttribute) {
          let isValidValue = this.config.validateValues
            ? hasValidValue(langAttrNode)
            : hasValue(langAttrNode);
          if (!isValidValue) {
            this.log({
              message: ERROR_MESSAGE,
              node,
            });
          }
        }
      },
    };
  }
}

export function parseConfig(config) {
  if (config === true) {
    return DEFAULT_CONFIG;
  }

  if (config && typeof config === 'object') {
    return {
      validateValues:
        'validateValues' in config ? config.validateValues : DEFAULT_CONFIG.validateValues,
    };
  }
}

'use strict';

const isAngleBracketComponent = require('../helpers/is-angle-bracket-component');
const Rule = require('./_base');

module.exports = class NoBlockParamsForHtmlElements extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (
          node.blockParams.length !== 0 &&
          !isAngleBracketComponent(this.scope, node) &&
          !node.tag.startsWith(':')
        ) {
          this.log({
            message: NoBlockParamsForHtmlElements.generateErrorMessage(node.tag),
            node,
          });
        }
      },
    };
  }

  static generateErrorMessage(tagName) {
    return `Block parameters on <${tagName}> elements are disallowed`;
  }
};

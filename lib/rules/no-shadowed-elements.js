'use strict';

const isAngleBracketComponent = require('../helpers/is-angle-bracket-component');
const Rule = require('./_base');

module.exports = class NoShadowedElements extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        // not a local, so cannot be shadowing native element
        if (!this.isLocal(node)) {
          return;
        }

        // not an angle bracket invocation at all, can't be shadowing
        if (!isAngleBracketComponent(this.scope, node)) {
          return;
        }

        let firstChar = node.tag.charAt(0);
        let startsWithUpperCase =
          firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
        let containsDot = node.tag.includes('.');

        if (!startsWithUpperCase && !containsDot) {
          this.log({
            message: `Ambiguous element used (\`${node.tag}\`)`,
            node,
          });
        }
      },
    };
  }
};

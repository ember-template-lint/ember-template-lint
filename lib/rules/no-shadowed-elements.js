import isAngleBracketComponent from '../helpers/is-angle-bracket-component.js';
import Rule from './_base.js';

export default class NoShadowedElements extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<NoShadowedElements>}
   */
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
}

import Rule from './_base.js';

const FINE_SYMBOLS = ['|', '/', '\\'];
export default class NoPotentialPathStrings extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<NoPotentialPathStrings>}
   */
  visitor() {
    return {
      AttrNode(node) {
        let { value } = node;
        if (value.type !== 'TextNode') {
          return;
        }
        const chars = value.chars;
        const haveSpecialPrefix = chars.startsWith('this.') || chars.startsWith('@');

        if (haveSpecialPrefix && !FINE_SYMBOLS.some((symbol) => chars.includes(symbol))) {
          this.log({
            message: NoPotentialPathStrings.generateErrorMessage(value.chars),
            node: value,
          });
        }
      },
    };
  }

  static generateErrorMessage(path) {
    return `Potential path in attribute string detected. Did you mean {{${path}}}?`;
  }
}

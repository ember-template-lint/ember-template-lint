import Rule from './_base.js';

export const ERROR_MESSAGE =
  'Using `...attributes` with `class` attribute is not allowed. Use `...attributes` alone to allow class merging.';

export default class NoSplattributesWithClass extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<NoSplattributesWithClass>}
   */
  visitor() {
    return {
      ElementNode(node) {
        const hasSplattributes = node.attributes.some((attr) => attr.name === '...attributes');
        const hasClass = node.attributes.some((attr) => attr.name === 'class');

        if (hasSplattributes && hasClass) {
          this.log({
            message: ERROR_MESSAGE,
            node: node.attributes.find((attr) => attr.name === 'class'),
          });
        }
      },
    };
  }
}

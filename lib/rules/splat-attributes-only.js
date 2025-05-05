import Rule from './_base.js';

const ERROR_MESSAGE = 'Only `...attributes` can be applied to elements';

export default class SplatAttributesOnly extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<SplatAttributesOnly>}
   */
  visitor() {
    return {
      AttrNode(node) {
        if (node.name.startsWith('...') && node.name !== '...attributes') {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
}

import Rule from './_base.js';

const ERROR_MESSAGE = 'Nested splattributes are not allowed';

export default class NoNestedSplattributes extends Rule {
  visitor() {
    let splattributesParent = null;

    return {
      ElementNode: {
        enter(node) {
          let splattribute = node.attributes.find((it) => it.name === '...attributes');
          if (splattribute) {
            if (splattributesParent) {
              this.log({
                message: ERROR_MESSAGE,
                node: splattribute,
              });
            } else {
              splattributesParent = node;
            }
          }
        },
        exit(node) {
          if (splattributesParent === node) {
            splattributesParent = null;
          }
        },
      },
    };
  }
}

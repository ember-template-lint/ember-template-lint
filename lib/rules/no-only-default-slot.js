import Rule from './_base.js';

export const ERROR_MESSAGE =
  'Only default slot used — prefer direct block content without <:default> for clarity and simplicity.';

export default class NoOnlyDefaultSlot extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<NoOnlyDefaultSlot>}
   */
  visitor() {
    return {
      ElementNode(node, path) {
        if (node.tag === ':default') {
          if (path.parent.node.type === 'ElementNode') {
            if (path.parent.node.children.length === 1) {
              if (this.mode === 'fix') {
                path.parent.node.children = node.children;
              } else {
                this.log({
                  message: ERROR_MESSAGE,
                  node,
                  isFixable: true,
                });
              }
            }
          }
        }
      },
    };
  }
}

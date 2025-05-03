import Rule from './_base.js';

const ERROR_MESSAGE =
  'The handlebars `mut(attr)` helper should only have one argument passed to it. To pass a value, use: `(action (mut attr) value)`.';

export default class NoExtraMutHelperArgument extends Rule {
  visitor() {
    return {
      SubExpression(node) {
        if (node.path.original !== 'mut') {
          return;
        }

        if (node.params.length === 1) {
          // Correct usage.
          return;
        }

        this.log({
          message: ERROR_MESSAGE,
          node,
        });
      },
    };
  }
}

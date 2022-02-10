import Rule from './_base.js';

export function ERROR_MESSAGE(expression) {
  return `Obscure expressions are prohibited. ${expression}. Please use Ember's get helper instead. i.e {{get list '0'}} `;
}

const regex = new RegExp(/\w+.\d/);
export default class NoObscureArrayAccess extends Rule {
  visitor() {
    return {
      PathExpression(node) {
        // Regex test for any word character plus digit. i.e.  "test.1"
        if (node.original && regex.test(node.original)) {
          this.log({
            message: ERROR_MESSAGE(node.original),
            source: `${node.original}`,
            node,
          });
        }
      },
    };
  }
}

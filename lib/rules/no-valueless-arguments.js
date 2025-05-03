import Rule from './_base.js';

const ERROR_MESSAGE = 'Named arguments should have an explicitly assigned value.';

export default class NoValuelessArguments extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        let { name, isValueless } = node;

        if (isNamedArgument(name) && isValueless) {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
}

function isNamedArgument(attrName) {
  return attrName.startsWith('@');
}

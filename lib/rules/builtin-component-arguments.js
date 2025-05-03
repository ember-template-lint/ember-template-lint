import Rule from './_base.js';

const FORBIDDEN_ATTRIBUTES = {
  Input: new Set(['checked', 'type', 'value']),
  Textarea: new Set(['value']),
};

export default class BuiltinComponentArguments extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let { attributes, tag } = node;

        let forbiddenAttributes = FORBIDDEN_ATTRIBUTES[tag];
        if (forbiddenAttributes) {
          for (let attribute of attributes) {
            if (forbiddenAttributes.has(attribute.name)) {
              this.log({
                message: BuiltinComponentArguments.generateErrorMessage(node.tag, attribute.name),
                node: attribute,
              });
            }
          }
        }
      },
    };
  }

  static generateErrorMessage(component, argument) {
    return `Setting the \`${argument}\` attribute on the builtin <${component}> component is not allowed. Did you mean \`@${argument}\`?`;
  }
}

'use strict';

const Rule = require('./base');

const FORBIDDEN_ATTRIBUTES = {
  Input: new Set(['checked', 'type', 'value']),
};

module.exports = class BuiltinComponentArguments extends Rule {
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
                line: attribute.loc && attribute.loc.start.line,
                column: attribute.loc && attribute.loc.start.column,
                source: this.sourceForNode(attribute),
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
};

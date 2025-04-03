import Rule from './_base.js';
import { parseImports } from '../helpers/import-handler.js';

const FORBIDDEN_ATTRIBUTES = {
  Input: new Set(['checked', 'type', 'value']),
  Textarea: new Set(['value']),
};

const COMPONENTS = new Set(Object.keys(FORBIDDEN_ATTRIBUTES));

export default class BuiltinComponentArguments extends Rule {
  visitor() {
    const importedComponents =
      this.isStrictMode && this.fullSource
        ? parseImports(this.fullSource, COMPONENTS, this.filePath)
        : new Map();

    return {
      ElementNode(node) {
        let { attributes, tag } = node;
        let componentName = tag;

        if (this.isStrictMode) {
          const importedName = importedComponents.get(tag);
          if (importedName) {
            componentName = importedName;
          } else {
            return;
          }
        } else if (!COMPONENTS.has(tag)) {
          return;
        }

        let forbiddenAttributes = FORBIDDEN_ATTRIBUTES[componentName];
        if (forbiddenAttributes) {
          for (let attribute of attributes) {
            if (forbiddenAttributes.has(attribute.name)) {
              this.log({
                message: BuiltinComponentArguments.generateErrorMessage(
                  componentName,
                  attribute.name
                ),
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

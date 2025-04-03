import Rule from './_base.js';
import { parseImports } from '../helpers/import-handler.js';

const WHY = 'Built-in form components use two-way binding to mutate values.';
const ACTION = 'Instead, refactor to use a native HTML element.';
export const MESSAGES = {
  Input: `Do not use the \`Input\` component. ${WHY} ${ACTION}`,
  Textarea: `Do not use the \`Textarea\` component. ${WHY} ${ACTION}`,
};

const COMPONENTS = new Set(['Input', 'Textarea']);

export default class NoBuiltinFormComponents extends Rule {
  visitor() {
    const importedComponents =
      this.isStrictMode && this.fullSource
        ? parseImports(this.fullSource, COMPONENTS, this.filePath)
        : new Map();

    return {
      ElementNode(node) {
        if (this.isStrictMode) {
          const importedName = importedComponents.get(node.tag);
          if (importedName) {
            this.log({
              message: MESSAGES[importedName],
              node,
            });
          }
        } else {
          if (COMPONENTS.has(node.tag)) {
            this.log({
              message: MESSAGES[node.tag],
              node,
            });
          }
        }
      },
    };
  }
}

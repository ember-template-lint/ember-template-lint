import Rule from './_base.js';

const WHY = 'Built-in form components use two-way binding to mutate values.';
const ACTION = 'Instead, refactor to use a native HTML element.';
export const MESSAGES = {
  Input: `Do not use the \`Input\` component. ${WHY} ${ACTION}`,
  Textarea: `Do not use the \`Textarea\` component. ${WHY} ${ACTION}`,
};

const COMPONENTS = new Set(['Input', 'Textarea']);

export default class NoBuiltinFormComponents extends Rule {
  visitor() {
    const importedComponents = new Map();

    if (this.isStrictMode && this.fullSource) {
      try {
        // Use a simple regex approach to find imports from '@ember/component'
        const importRegex = /import\s+{([^}]*)}\s+from\s+["']@ember\/component["']/g;
        let match;

        while ((match = importRegex.exec(this.fullSource)) !== null) {
          const importSpecifiers = match[1];
          // Split by comma and process each import specifier
          const specifiers = importSpecifiers.split(',').map(s => s.trim());

          for (const specifier of specifiers) {
            // Handle "Input" or "Input as CustomInput" format
            const parts = specifier.split(/\s+as\s+/);
            const importedName = parts[0].trim();
            const localName = parts.length > 1 ? parts[1].trim() : importedName;

            if (COMPONENTS.has(importedName)) {
              importedComponents.set(localName, importedName);
            }
          }
        }
      } catch {
        // Silently fail if parsing fails
      }
    }

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

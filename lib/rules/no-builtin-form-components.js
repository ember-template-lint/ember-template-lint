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
    return {
      ElementNode(node) {
        if (COMPONENTS.has(node.tag)) {
          this.log({
            message: MESSAGES[node.tag],
            node,
          });
        }
      },
    };
  }
}

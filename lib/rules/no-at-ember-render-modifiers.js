import Rule from './_base.js';

const WHY = `This modifier was intended to ease migration to Octane and not for long-term side-effects.`;
const ACTION = `Instead, refactor to use a custom modifier. See https://github.com/ember-modifier/ember-modifier`;
export const MESSAGES = {
  'did-insert': `Do not use the \`did-insert\` modifier. ${WHY} ${ACTION}`,
  'did-update': `Do not use the \`did-update\` modifier. ${WHY} ${ACTION}`,
  'will-destroy': `Do not use the \`will-destroy\` modifier. ${WHY} ${ACTION}`,
};

const MODIFIERS = new Set([`did-insert`, `did-update`, `will-destroy`]);

export default class NoAtEmberRenderModifiers extends Rule {
  visitor() {
    return {
      ElementModifierStatement(node) {
        let modifierName = node.path.original;
        if (!MODIFIERS.has(modifierName)) {
          return;
        }

        this.log({
          message: MESSAGES[modifierName],
          node,
          source: this.sourceForNode(node),
        });
      },
    };
  }
}

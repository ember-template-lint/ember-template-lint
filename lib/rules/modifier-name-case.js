import dasherize from '../helpers/dasherize-component-name.js';
import Rule from './_base.js';

function generateErrorMessage(modifierName) {
  let dasherizeModifierName = dasherize(modifierName);
  return `Use dasherized names for modifier invocation. Please replace \`${modifierName}\` with \`${dasherizeModifierName}\`.`;
}

export default class ModifierNameCase extends Rule {
  visitor() {
    return {
      ElementModifierStatement(node) {
        let modifierName = node.path.original;

        if (modifierName === dasherize(modifierName)) {
          return;
        }

        this.log({
          message: generateErrorMessage(modifierName),
          node: node.path,
        });
      },
    };
  }
}

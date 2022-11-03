import dasherize from '../helpers/dasherize-component-name.js';
import { match } from '../helpers/node-matcher.js';
import Rule from './_base.js';

function generateErrorMessage(modifierName) {
  let dasherizeModifierName = dasherize(modifierName);
  return `Use dasherized names for modifier invocation. Please replace \`${modifierName}\` with \`${dasherizeModifierName}\`.`;
}

export default class ModifierNameCase extends Rule {
  visitor() {
    return {
      ElementModifierStatement(node) {
        this._validateModifierName(node.path);
      },

      SubExpression(node) {
        if (!isModifierHelper(node)) {
          return;
        }

        let nameParam = node.params[0];

        if (nameParam && nameParam.type === 'StringLiteral') {
          this._validateModifierName(nameParam);
        }
      },
    };
  }

  _validateModifierName(node) {
    let modifierName = node.original;

    if (typeof modifierName !== 'string' || modifierName === dasherize(modifierName)) {
      return;
    }

    if (this.mode === 'fix') {
      if (node.type === 'StringLiteral') {
        node.value = dasherize(modifierName);
      } else {
        node.original = dasherize(modifierName);
      }
    } else {
      this.log({
        message: generateErrorMessage(modifierName),
        node,
        isFixable: true,
      });
    }
  }
}

function isModifierHelper(node) {
  return match(node.path, { original: 'modifier', type: 'PathExpression' });
}

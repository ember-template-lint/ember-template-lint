import Rule from './_base.js';
import { match } from '../helpers/node-matcher.js';

export default class SimpleModifiers extends Rule {
  visitor() {
    return {
      SubExpression(node) {
        if (!this._isModifier(node)) {
          return;
        }

        const firstModifierParam = node.params[0];
        if (firstModifierParam) {
          this._validateModifier(firstModifierParam);
        }
      },
    };
  }

  _validateModifier(node) {
    // First argument of the modifier must be a string
    if (node.type === 'StringLiteral' || node.type === 'PathExpression') {
      return;
    }

    this.log({
      message:
        'The modifier helper should have a string or a variable name containing the modifier name as a first argument.',
      node,
    });
  }

  _isModifier(node) {
    return match(node.path, { original: 'modifier', type: 'PathExpression' });
  }
}

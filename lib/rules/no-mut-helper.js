import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

const message =
  'Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.';
function generateMessageWithAlternative(setAlternative) {
  return `Unexpected usage of mut helper. If using mut as a setter, consider using a JS action or ${setAlternative} instead.`;
}

export default class NoMutHelper extends Rule {
  parseConfig(config) {
    if (!config || !config.setterAlternative) {
      return {};
    } else if (typeof config.setterAlternative === 'string') {
      return config;
    } else {
      let errorMessage = createErrorMessage(
        this.ruleName,
        [
          '  * object -- An object with the following key:',
          `    * \`setterAlternative\` -- (Optional) If the app defines or depends on a \`{{set}}\` helper,
                    this rule error message could suggest using that helper as a way to resolve the violation.
                    If this config is not defined, the error message will default to only suggesting a JS action.`,
        ],
        config
      );

      throw new Error(errorMessage);
    }
  }

  visitor() {
    return {
      MustacheStatement(node) {
        this._checkForMutHelper(node);
      },

      SubExpression(node) {
        this._checkForMutHelper(node);
      },
    };
  }

  _checkForMutHelper(node) {
    if (node.path.type === 'PathExpression' && node.path.original === 'mut') {
      if (this.config.setterAlternative) {
        this.log({
          message: generateMessageWithAlternative(this.config.setterAlternative),
          node,
        });
      } else {
        this.log({
          message,
          node,
        });
      }
    }
  }
}

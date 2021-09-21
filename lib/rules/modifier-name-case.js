'use strict';

const dasherize = require('../helpers/dasherize-component-name');
const Rule = require('./_base');

function generateErrorMessage(modifierName) {
  let dasherizeModifierName = dasherize(modifierName);
  return `Use dasherized names for modifier invocation. Please replace \`${modifierName}\` with \`${dasherizeModifierName}\`.`;
}

module.exports = class ModifierNameCase extends Rule {
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
};

module.exports.generateErrorMessage = generateErrorMessage;

'use strict';

const dasherize = require('../helpers/dasherize-component-name');
const Rule = require('./base');

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
          line: node.path.loc && node.path.loc.start.line,
          column: node.path.loc && node.path.loc.start.column,
          source: this.sourceForNode(node.path),
        });
      },
    };
  }
};

module.exports.generateErrorMessage = generateErrorMessage;

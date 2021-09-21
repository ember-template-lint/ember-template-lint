'use strict';

const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./_base');

const ERROR_MESSAGE = 'Do not use the `action` modifier. Instead, use the `on` modifier.';

module.exports = class NoActionModifiers extends Rule {
  parseConfig(config) {
    switch (typeof config) {
      case 'boolean':
        if (config) {
          return { allowlist: [] };
        } else {
          return false;
        }
      case 'object':
        if (Array.isArray(config)) {
          return { allowlist: config };
        }
        break;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      ['  * array of strings - tag names of elements that can accept {{action}} modifiers'],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      ElementModifierStatement(node, { parentNode }) {
        let modifierName = node.path.original;
        if (modifierName !== 'action') {
          return;
        }

        if (this.config.allowlist.includes(parentNode.tag)) {
          return;
        }

        this.log({
          message: ERROR_MESSAGE,
          node,
          source: this.sourceForNode(parentNode),
        });
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

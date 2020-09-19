'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

// TODO Change template to the real error message that you want to report
const ERROR_MESSAGE = '{{#each}} block requires a valid key value to avoid performance issues';

const SPECIAL_KEY_VALUES = new Set(['@index', '@identity']);

module.exports = class RequireEachKey extends Rule {
  visitor() {
    return {
      // Simple template example: disallowed text present in TextNode
      BlockStatement(node) {
        let isEach = AstNodeInfo.isEach(node);
        let keyPair = node.hash.pairs.find((p) => p.key === 'key');
        let keyValue = keyPair && keyPair.value && keyPair.value.value;
        let isSpecialKey = keyValue && keyValue.startsWith('@');
        let isValidKey = isSpecialKey ? SPECIAL_KEY_VALUES.has(keyValue) : true;
        let noKey = isEach && !keyPair;
        let invalidKey = isEach && !isValidKey;
        if (noKey || invalidKey) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

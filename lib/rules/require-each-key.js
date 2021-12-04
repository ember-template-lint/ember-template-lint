import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const ERROR_MESSAGE = '{{#each}} helper requires a valid key value to avoid performance issues';

const SPECIAL_KEY_VALUES = new Set(['@index', '@identity']);

export default class RequireEachKey extends Rule {
  visitor() {
    return {
      BlockStatement(node) {
        const isEach = AstNodeInfo.isEach(node);
        const keyPair = node.hash.pairs.find((p) => p.key === 'key');
        const keyValue = keyPair && keyPair.value && keyPair.value.value;
        const isSpecialKey = keyValue && keyValue.startsWith('@');
        const isValidKey = isSpecialKey ? SPECIAL_KEY_VALUES.has(keyValue) : keyValue;
        const noKey = isEach && !keyPair;
        const invalidKey = isEach && !isValidKey;
        if (noKey || invalidKey) {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
}

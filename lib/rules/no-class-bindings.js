import Rule from './_base.js';

export default class NoClassBindings extends Rule {
  visitor() {
    function check(node) {
      let isAttrNode = node.type === 'AttrNode';
      let specifiedKey = isAttrNode ? node.name : node.key;
      let argumentName = isAttrNode ? node.name : `@${node.key}`;

      if (argumentName === '@classBinding' || argumentName === '@classNameBindings') {
        this.log({
          message: `Passing the \`${specifiedKey}\` property as an argument within templates is not allowed.`,
          node,
        });
      }
    }

    return {
      AttrNode: check,
      HashPair: check,
    };
  }
}

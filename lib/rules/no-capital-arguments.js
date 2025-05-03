import Rule from './_base.js';

const ERROR_MESSAGE_CAPITAL = 'Capital argument names is not supported';
export function ERROR_MESSAGE_RESERVED(name) {
  return `${name} is reserved argument name, try to use another`;
}

const AllowedPrefix = /[a-z]/;
const RESERVED = new Set(['@arguments', '@args', '@block', '@else']);

export default class NoCapitalArguments extends Rule {
  isReserved(name) {
    return RESERVED.has(name);
  }
  visitor() {
    return {
      PathExpression(node) {
        if (node.data) {
          let part = node.parts[0] || '';
          let firstChar = part.charAt(0);
          let isReserved = this.isReserved(`@${part}`);
          if (!AllowedPrefix.test(firstChar) || isReserved) {
            this.log({
              message: isReserved ? ERROR_MESSAGE_RESERVED(`@${part}`) : ERROR_MESSAGE_CAPITAL,
              node,
              column: node.loc && node.loc.start.column + 1,
              source: part,
            });
          }
        }
      },
      AttrNode(node) {
        if (node.name.startsWith('@')) {
          let firstChar = node.name.charAt(1);
          let isReserved = this.isReserved(node.name);
          if (!AllowedPrefix.test(firstChar) || isReserved) {
            this.log({
              message: isReserved ? ERROR_MESSAGE_RESERVED(node.name) : ERROR_MESSAGE_CAPITAL,
              node,
              source: this.sourceForNode(node).slice(1, node.name.length),
            });
          }
        }
      },
    };
  }
}

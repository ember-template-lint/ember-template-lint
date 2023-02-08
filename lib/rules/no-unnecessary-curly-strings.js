import Rule from './_base.js';

const LITERALS = new Set([
  'StringLiteral',
  'BooleanLiteral',
  'NumberLiteral',
  'UndefinedLiteral',
  'NullLiteral',
]);

export default class NoUnnecessaryCurlyStrings extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (LITERALS.has(node.path.type)) {
          this.log({
            node,
            message: `Unnecessary curly braces around ${node.path.type}`,
          });
        }
      },
    };
  }
}

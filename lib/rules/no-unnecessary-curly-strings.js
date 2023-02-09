import Rule from './_base.js';

export default class NoUnnecessaryCurlyStrings extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.type === 'StringLiteral') {
          this.log({
            node,
            message: 'Unnecessary curly braces around string',
          });
        }
      },
    };
  }
}

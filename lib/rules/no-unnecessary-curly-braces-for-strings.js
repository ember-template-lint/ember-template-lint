import { builders as b } from 'ember-template-recast';
import Rule from './_base.js';

export default class NoUnnecessaryCurlyBracesForStrings extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.type === 'StringLiteral') {
          if (this.mode === 'fix') {
            let newNode = b.text(node.path);
            return newNode.chars;
          } else {
            this.log({
              node,
              isFixable: true,
              message: 'Unnecessary curly braces around string',
            });
          }
        }
      },
    };
  }
}

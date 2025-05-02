import Rule from './_base.js';
import { builders as b } from 'ember-template-recast';
import replaceNode from '../helpers/replace-node.js';

export default class NoUnnecessaryCurlyStrings extends Rule {
  visitor() {
    return {
      MustacheStatement(node, { parentNode, parentKey }) {
        if (node.path.type === 'StringLiteral') {
          if (this.mode === 'fix') {
            if (parentNode.type === 'AttrNode') {
              parentNode.quoteType = node.path.quoteType;
            }
            const newNode = b.text(node.path.original);
            replaceNode(node, parentNode, parentKey, newNode);
          } else {
            this.log({
              node,
              message: 'Unnecessary curly braces around string',
              isFixable: true,
            });
          }
        }
      },
    };
  }
}

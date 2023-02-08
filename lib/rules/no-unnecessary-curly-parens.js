import { builders as b } from 'ember-template-recast';

import Rule from './_base.js';
import replaceNode from '../helpers/replace-node.js';

export default class NoUnnecessaryCurlyParens extends Rule {
  visitor() {
    return {
      MustacheStatement(node, path) {
        if (
          node.path.type === 'SubExpression' &&
          (node.path.params.length || node.path.hash.pairs.length)
        ) {
          if (this.mode === 'fix') {
            replaceNode(
              node,
              path.parentNode,
              path.parentKey,
              b.mustache(node.path.path, node.path.params, node.path.hash)
            );
          } else {
            this.log({
              node,
              isFixable: true,
              message: 'Unnecessary parentheses enclosing statement',
            });
          }
        }
      },
    };
  }
}

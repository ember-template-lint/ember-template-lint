import Rule from './_base.js';
import { builders as b } from 'ember-template-recast';

export default class NoUnnecessaryCurlyParens extends Rule {
  isFixableMustache(node) {
    return (
      node.path.type === 'SubExpression' && (node.path.params.length || node.path.hash.pairs.length)
    );
  }
  fixedMustacheNode(node) {
    const params = node.path.params;
    const hash = node.path.hash;
    return b.mustache(node.path.path, params, hash);
  }
  /**
   * @returns {import('./types.js').VisitorReturnType<NoUnnecessaryCurlyParens>}
   */
  visitor() {
    return {
      ConcatStatement(node) {
        if (this.mode === 'fix') {
          node.parts = node.parts.map((part) => {
            if (part.type === 'MustacheStatement' && this.isFixableMustache(part)) {
              return this.fixedMustacheNode(part);
            } else if (part.type === 'TextNode') {
              return b.text(part.chars);
            } else {
              return part;
            }
          });
        }
      },
      MustacheStatement(node) {
        if (this.isFixableMustache(node)) {
          if (this.mode === 'fix') {
            return this.fixedMustacheNode(node);
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

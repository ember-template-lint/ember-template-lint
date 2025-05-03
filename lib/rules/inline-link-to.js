import { builders as b } from 'ember-template-recast';

import replaceNode from '../helpers/replace-node.js';
import Rule from './_base.js';

const message = 'The inline form of link-to is not allowed. Use the block form instead.';

export default class InlineLinkTo extends Rule {
  visitor() {
    return {
      MustacheStatement(node, { parentNode, parentKey }) {
        if (node.path.original === 'link-to') {
          let titleNode = node.params[0];
          let isFixable = titleNode.type === 'SubExpression' || titleNode.type === 'StringLiteral';

          if (this.mode === 'fix' && isFixable) {
            let newBody;
            if (titleNode.type === 'SubExpression') {
              newBody = b.mustache(titleNode.path, titleNode.params, titleNode.hash);
            } else if (titleNode.type === 'StringLiteral') {
              newBody = b.text(titleNode.value);
            }

            replaceNode(
              node,
              parentNode,
              parentKey,
              b.block(node.path, node.params.slice(1), node.hash, b.blockItself([newBody]))
            );
          } else {
            this.log({
              message,
              node,
              isFixable,
            });
          }
        }
      },
    };
  }
}

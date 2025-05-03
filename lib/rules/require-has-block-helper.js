import { builders as b } from 'ember-template-recast';

import Rule from './_base.js';

const TRANSFORMATIONS = {
  hasBlock: 'has-block',
  hasBlockParams: 'has-block-params',
};

function getErrorMessage(name) {
  return `\`${name}\` is deprecated. Use the \`${TRANSFORMATIONS[name]}\` helper instead.`;
}

export default class RequireHasBlockHelper extends Rule {
  visitor() {
    return {
      PathExpression(node, path) {
        if (this.mode === 'fix') {
          if (TRANSFORMATIONS[node.original]) {
            let parent = path.parent;
            let isBlockStatement = parent.node.type === 'BlockStatement';
            let isImplicitInvocation =
              ['MustacheStatement', 'SubExpression'].includes(parent.node.type) &&
              parent.node.path.original !== node.original;
            if (isBlockStatement || isImplicitInvocation) {
              const paramIndex = parent.node.params.findIndex((param) => {
                return param.original === node.original;
              });

              parent.node.params[paramIndex] = b.sexpr(TRANSFORMATIONS[node.original], []);
            } else {
              node.original = TRANSFORMATIONS[node.original];
            }
          }
        } else {
          if (TRANSFORMATIONS[node.original]) {
            this.log({
              message: getErrorMessage(node.original),
              node,
              isFixable: true,
            });
          }
        }
      },
    };
  }
}

'use strict';

const { builders: b } = require('ember-template-recast');

const Rule = require('./_base');

const message = 'The inline form of link-to is not allowed. Use the block form instead.';

module.exports = class InlineLinkTo extends Rule {
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

            let index = parentNode[parentKey].indexOf(node);
            parentNode[parentKey][index] = b.block(
              node.path,
              node.params.slice(1),
              node.hash,
              b.blockItself([newBody])
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
};

module.exports.message = message;

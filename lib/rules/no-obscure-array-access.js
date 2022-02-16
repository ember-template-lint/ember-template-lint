import { builders } from 'ember-template-recast';

import Rule from './_base.js';

const PATH_REGEXP = /\.\d+(\.|$)/;
const DIGIT_REGEXP = /^\d+$/;

const ERROR_MESSAGE =
  "Obscure expressions are prohibited. Please use Ember's get helper instead. e.g. {{get @list '0'}}";

/**
 * generate a tuple of pathExpression before digit and string of parts after digit index e.g. [this.list, '0.name']
 *
 * @param {PathExpression} node The pathExpression node that should be wrapped in a get helper
 * @returns a tuple of path parts before digit and path parts after digit index e.g. [this.list, '0.name']
 */
function getHelperParams(node) {
  // use node.original instead of node.parts so the context isn't dropped
  const originalParts = node.original.split('.');
  const firstDigitIndex = originalParts.findIndex((part) => DIGIT_REGEXP.test(part));

  return [
    builders.path({ head: originalParts.slice(0, firstDigitIndex).join('.') }, node.loc),
    builders.literal('StringLiteral', originalParts.slice(firstDigitIndex).join('.'), node.loc),
  ];
}

export default class NoObscureArrayAccess extends Rule {
  visitor() {
    return {
      PathExpression(node, path) {
        if (node.original && PATH_REGEXP.test(node.original)) {
          if (this.mode === 'fix') {
            // for paths with a MustacheStatement parentNode replace the pathExpression with a get helper pathExpression
            if (path.parentNode.type === 'MustacheStatement') {
              path.parentNode[path.parentKey] = builders.path('get', node.loc);
              path.parentNode.params = getHelperParams(node);
            } else {
              // replace the pathExpression with a get helper subExpression
              node = builders.sexpr('get', getHelperParams(node));
            }
          } else {
            this.log({
              message: ERROR_MESSAGE,
              source: `${node.original}`,
              node,
              isFixable: true,
            });
          }
        }

        return node;
      },
    };
  }
}

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
    builders.path({ head: originalParts.slice(0, firstDigitIndex).join('.') }),
    builders.literal('StringLiteral', originalParts.slice(firstDigitIndex).join('.')),
  ];
}

export default class NoObscureArrayAccess extends Rule {
  isFixablePath(node) {
    return node.type === 'PathExpression' && node.original && PATH_REGEXP.test(node.original);
  }
  /**
   * @returns {import('./types.js').VisitorReturnType<NoObscureArrayAccess>}
   */
  visitor() {
    return {
      MustacheStatement: {
        exit(node) {
          const shouldFixPath = this.isFixablePath(node.path);
          const shouldFixParams = node.params.some((param) => this.isFixablePath(param));
          if (shouldFixPath && this.mode === 'fix') {
            return builders.mustache(
              builders.path('get'),
              [...getHelperParams(node.path), ...node.params],
              node.hash
            );
          }
          if (shouldFixParams && this.mode === 'fix') {
            for (let i = 0; i < node.params.length; i++) {
              if (this.isFixablePath(node.params[i])) {
                node.params[i] = builders.sexpr('get', getHelperParams(node.params[i]));
              }
            }
          }
          return node;
        },
      },
      PathExpression(node, path) {
        if (this.isFixablePath(node)) {
          if (this.mode === 'fix') {
            if (path.parentNode.type !== 'MustacheStatement') {
              return builders.sexpr('get', getHelperParams(node));
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
      },
    };
  }
}

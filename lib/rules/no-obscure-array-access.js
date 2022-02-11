import { builders } from 'ember-template-recast';

import Rule from './_base.js';

export function ERROR_MESSAGE() {
  return `Obscure expressions are prohibited. Please use Ember's get helper instead. e.g. {{get @list '0'}} `;
}

/**
 * Build params needed to wrap array path access with a get helper sub-expression
 *
 * @param {PathExpression} node The pathExpression node
 * @returns {Array} A tuple of PathExpression | SubExpression, representing the params for a get sub-expression
 */
function buildParams(node) {
  if (!node.parts) {
    return [];
  }

  const intParts = node.parts.filter((part) => Number(part) === 0 || Number(part));
  const originalParts = node.original.split('.');
  const intPartIndexes = intParts.map((intPart) => originalParts.indexOf(intPart));
  let params = [];

  // iterate over the array index parts of the pathExpression, we want to use the get helper to access these
  for (const [i, idx] of intPartIndexes.entries()) {
    // on the first iteration create the path tuple containing the path parts before the first array part and the array index part, e.g. ['this.item', '0']
    if (!params.length) {
      params = [
        builders.path({ head: originalParts.slice(0, idx).join('.') }, node.loc),
        builders.path(`'${originalParts.slice(idx, idx + 1).join('.')}'`, node.loc),
      ];
    } else {
      /**
       * if there is more than 1 array index part nest the first path sub-expression in another
       * e.g. [
       *        (get (get 'this.item', '0') 'value.foo.bar')
       *        '1' // Nth array index part
       *      ]
       * */
      params = [
        builders.sexpr(builders.path('get', node.loc), [
          builders.sexpr(builders.path('get', node.loc), [...params]),
          builders.path(
            `'${originalParts.slice(intPartIndexes[i - 1] + 1, idx).join('.')}'`,
            node.loc
          ),
        ]),
        builders.path(`'${originalParts.slice(idx, idx + 1).join('.')}'`, node.loc),
      ];
    }
  }

  // if the last array index part is not the last path segment then add another get sub-expression and add the remaining path segments to the tuple
  const lastIntIndex = intPartIndexes.pop();
  if (lastIntIndex !== originalParts.length - 1) {
    params = [
      builders.sexpr(builders.path('get', node.loc), [...params]),
      builders.path(`'${originalParts.slice(lastIntIndex + 1).join('.')}'`, node.loc),
    ];
  }

  return params;
}

export default class NoObscureArrayAccess extends Rule {
  visitor() {
    return {
      PathExpression(node, path) {
        if (node.original && /\w+.\d/.test(node.original)) {
          if (this.mode === 'fix') {
            const params = buildParams(node);
            // for MustacheStatement we need to set the parentKey as a get pathExpression
            if (path.parentNode.type === 'MustacheStatement') {
              path.parentNode[path.parentKey] = builders.path('get', node.loc);
              path.parentNode.params = params;
            } else {
              // in all other cases use a get subExpression
              path.parentNode[path.parentKey] = builders.sexpr(
                builders.path('get', node.loc),
                params
              );
            }

            return;
          }
          this.log({
            message: ERROR_MESSAGE(),
            source: `${node.original}`,
            node,
            isFixable: true,
          });
        }
      },
    };
  }
}

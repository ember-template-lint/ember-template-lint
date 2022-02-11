import { builders } from 'ember-template-recast';

import Rule from './_base.js';

export function ERROR_MESSAGE(expression) {
  return `Obscure expressions are prohibited. ${expression}. Please use Ember's get helper instead. i.e {{get @list '0'}} `;
}

function buildParams(node) {
  const intParts = node.parts && node.parts.filter((part) => Number(part) === 0 || Number(part));
  const originalParts = node.original.split('.');
  const intPartIndexes = intParts.map((intPart) => originalParts.indexOf(intPart));
  let params = [];

  for (const [i, idx] of intPartIndexes.entries()) {
    if (!params.length) {
      params = [
        builders.path({ head: originalParts.slice(0, idx).join('.') }, node.loc),
        builders.path(`'${originalParts.slice(idx, idx + 1).join('.')}'`, node.loc),
      ];
    } else {
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
            let sub = builders.sexpr(builders.path('get', node.loc), params);
            if (path.parentNode.type === 'MustacheStatement') {
              path.parentNode[path.parentKey] = builders.path('get', node.loc);
              path.parentNode.params = params;
            } else {
              path.parentNode[path.parentKey] = sub;
            }

            return;
          }
          this.log({
            message: ERROR_MESSAGE(node.original),
            source: `${node.original}`,
            node,
            isFixable: true,
          });
        }
      },
    };
  }
}

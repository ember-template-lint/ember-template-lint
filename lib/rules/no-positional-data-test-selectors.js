import { builders as b } from 'ember-template-recast';

import Rule from './_base.js';

const BUILT_INS = new Set([
  'action',
  'array',
  'component',
  'concat',
  'debugger',
  'each',
  'each-in',
  'fn',
  'get',
  'hasBlock',
  'has-block',
  'has-block-params',
  'hash',
  'if',
  'input',
  'let',
  'link-to',
  'loc',
  'log',
  'mount',
  'mut',
  'on',
  'outlet',
  'partial',
  'query-params',
  'textarea',
  'unbound',
  'unless',
  'with',
  '-in-element',
  'in-element',
]);

export default class NoPositionalDataTestSelectors extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        this.process(node);
      },
      BlockStatement(node) {
        this.process(node);
      },
    };
  }

  process(node) {
    if (BUILT_INS.has(node.path.original)) {
      return;
    }

    let testSelectorParamIndex = node.params.findIndex(
      (n) => n.type === 'PathExpression' && n.original.startsWith('data-test-')
    );

    if (testSelectorParamIndex === -1) {
      return;
    }

    if (this.mode === 'fix') {
      let selectorName = node.params[testSelectorParamIndex].original;

      // remove the item from `params`
      node.params.splice(testSelectorParamIndex, 1);

      // add it as a HashPair
      node.hash.pairs.unshift(b.pair(selectorName, b.boolean(true)));
    } else {
      this.log({
        message:
          'Passing a `data-test-*` positional param to a curly invocation should be avoided.',
        node,
        isFixable: true,
      });
    }
  }
}

import { builders as b } from 'ember-template-recast';

import replaceNode from '../helpers/replace-node.js';
import Rule from './_base.js';

const ERROR_MESSAGE = 'Invoke component directly instead of using `component` helper';

export default class NoUnnecessaryComponentHelper extends Rule {
  visitor() {
    let inSafeNamespace = false;
    const markAsSafeNamespace = {
      enter() {
        inSafeNamespace = true;
      },
      exit() {
        inSafeNamespace = false;
      },
    };

    function isComponentHelper(node) {
      return (
        node.path.type === 'PathExpression' &&
        node.path.original === 'component' &&
        node.params.length > 0
      );
    }

    function checkNode(node, { parentNode, parentKey }) {
      if (
        isComponentHelper(node) &&
        node.params[0].type === 'StringLiteral' &&
        !node.params[0].value.includes('@') &&
        !inSafeNamespace
      ) {
        if (this.mode === 'fix') {
          const newNode =
            node.type === 'BlockStatement'
              ? b.block(
                  b.path(node.params[0].value),
                  node.params.slice(1),
                  node.hash,
                  b.blockItself([])
                )
              : b.mustache(node.params[0].value, node.params.slice(1), node.hash);

          replaceNode(node, parentNode, parentKey, newNode);
        } else {
          this.log({
            message: ERROR_MESSAGE,
            node,
            isFixable: true,
          });
        }
      }
    }

    return {
      AttrNode: markAsSafeNamespace,
      BlockStatement: checkNode,
      MustacheStatement: checkNode,
    };
  }
}

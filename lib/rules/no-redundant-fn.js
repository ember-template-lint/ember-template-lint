import replaceNode from '../helpers/replace-node.js';
import Rule from './_base.js';

const ERROR_MESSAGE = '`fn` helpers without additional arguments are not allowed';

export default class NoRedundantFn extends Rule {
  visitor() {
    return {
      MustacheStatement(node, path) {
        return this.process(node, path);
      },
      SubExpression(node, path) {
        return this.process(node, path);
      },
    };
  }

  process(node, { parentNode, parentKey }) {
    let { path, params } = node;
    if (
      path.type !== 'PathExpression' ||
      path.original !== 'fn' ||
      params.length !== 1 ||
      params[0].type !== 'PathExpression'
    ) {
      return;
    }

    if (this.mode === 'fix') {
      if (node.type === 'MustacheStatement') {
        node.params = [];
        node.path = params[0];
      } else {
        replaceNode(node, parentNode, parentKey, params[0]);
      }
    } else {
      this.log({
        message: ERROR_MESSAGE,
        node,
        isFixable: true,
      });
    }
  }
}

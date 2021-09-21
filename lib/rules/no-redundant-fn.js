'use strict';

const Rule = require('./_base');

const ERROR_MESSAGE = '`fn` helpers without additional arguments are not allowed';

module.exports = class NoRedundantFn extends Rule {
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
        if (Array.isArray(parentNode[parentKey])) {
          let index = parentNode[parentKey].indexOf(node);
          parentNode[parentKey][index] = params[0];
        } else {
          parentNode[parentKey] = params[0];
        }
      }
    } else {
      this.log({
        message: ERROR_MESSAGE,
        node,
        isFixable: true,
      });
    }
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

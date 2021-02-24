'use strict';

const Rule = require('./base');

module.exports = class NoLinkToPositionalParams extends Rule {
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
    if (node.path.original === 'link-to' && node.params.length > 0) {
      let message = this.getMessage(node);

      this.log({ message, node });
    }
  }

  getMessage(node) {
    function getError(message) {
      return `Invoking the \`<LinkTo>\` component with positional arguments is deprecated. ${message}`;
    }

    if (node.params.length === 1 && node.params[0].type === 'StringLiteral') {
      return getError('Instead, please use the equivalent named arguments (`@route`).');
    }

    if (node.params.length === 2) {
      if (node.params.every((param) => param.type === 'StringLiteral')) {
        return getError(`Instead, please use the equivalent named arguments (\`@route\`) and pass a
  block for the link's content.`);
      }

      if (node.params[0].type === 'StringLiteral' && node.params[1].type === 'PathExpression') {
        return getError('Instead, please use the equivalent named arguments (`@route`, `@model`).');
      }

      if (
        node.params[0].type === 'StringLiteral' &&
        node.params[1].type === 'SubExpression' &&
        node.params[1].path.original === 'query-params'
      ) {
        return getError(`Instead, please use the equivalent named arguments (\`@route\`, \`@query\`) and the
\`hash\` helper.`);
      }
    }

    if (node.params.length === 3) {
      if (
        node.params[0].type === 'StringLiteral' &&
        node.params[1].type === 'PathExpression' &&
        node.params[2].type === 'PathExpression'
      ) {
        return getError(
          'Instead, please use the equivalent named arguments (`@route`, `@models`).'
        );
      }
    }
  }
};

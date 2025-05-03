import Rule from './_base.js';

export default class NoIndexComponentInvocation extends Rule {
  visitor() {
    const log = (invocation, replacement, node) => {
      return this.log({
        message: `Replace \`${invocation} ...\` to \`${replacement} ...\``,
        node,
      });
    };

    function lintIndexUsage(node) {
      if (node.type === 'ElementNode') {
        if (node.tag.endsWith('::Index')) {
          let invocation = `<${node.tag}`;
          let replacement = `<${node.tag.replace('::Index', '')}`;

          log(invocation, replacement, node);
        }
        return;
      }

      if (['MustacheStatement', 'BlockStatement'].includes(node.type)) {
        if (node.path.type === 'PathExpression' && node.path.original.endsWith('/index')) {
          let invocationPrefix = node.type === 'BlockStatement' ? '{{#' : '{{';
          let invocation = `${invocationPrefix}${node.path.original}`;
          let replacement = `${invocationPrefix}${node.path.original.replace('/index', '')}`;

          log(invocation, replacement, node.path);
          return;
        }
      }

      if (['MustacheStatement', 'BlockStatement', 'SubExpression'].includes(node.type)) {
        const prefix =
          node.type === 'MustacheStatement' ? '{{' : node.type === 'BlockStatement' ? '{{#' : '(';

        if (
          node.path.type === 'PathExpression' &&
          node.path.original === 'component' &&
          node.params.length &&
          node.params[0].type === 'StringLiteral'
        ) {
          const componentName = node.params[0].original;

          if (componentName.endsWith('/index')) {
            let invocation = `${prefix}component "${componentName}"`;
            let replacement = `${prefix}component "${componentName.replace('/index', '')}"`;

            return log(invocation, replacement, node.params[0]);
          }
        }
      }
    }

    return {
      ElementNode: lintIndexUsage,
      MustacheStatement: lintIndexUsage,
      BlockStatement: lintIndexUsage,
      SubExpression: lintIndexUsage,
    };
  }
}

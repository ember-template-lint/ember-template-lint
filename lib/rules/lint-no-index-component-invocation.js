'use strict';

const Rule = require('./base');

module.exports = class LintNoIndexComponentInvocation extends Rule {
  visitor() {
    const sourceForNode = this.sourceForNode.bind(this);
    const log = this.log.bind(this);
    function lintIndexUsage(node) {
      if (node.type === 'ElementNode') {
        if (node.tag.endsWith('::Index')) {
          return log({
            message: `Replace \`<${node.tag} ...\` to \`<${node.tag.replace('::Index', '')} ...\``,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: sourceForNode(node),
          });
        }
        return;
      }

      if (node.type === 'MustacheStatement') {
        if (node.path.type === 'PathExpression' && node.path.original.endsWith('/index')) {
          return log({
            message: `Replace \`{{${node.path.original} ...\` to \`{{${node.path.original.replace(
              '/index',
              ''
            )} ...\``,
            line: node.path.loc && node.path.loc.start.line,
            column: node.path.loc && node.path.loc.start.column,
            source: sourceForNode(node.path),
          });
        }
      }

      if (node.type === 'MustacheStatement' || node.type === 'SubExpression') {
        const prefix = node.type === 'MustacheStatement' ? '{{' : '(';
        if (
          node.path.type === 'PathExpression' &&
          node.path.original === 'component' &&
          node.params.length &&
          node.params[0].type === 'StringLiteral'
        ) {
          const componentName = node.params[0].original;
          if (componentName.endsWith('/index')) {
            return log({
              message: `Replace \`${prefix}component "${componentName}" ...\` to \`${prefix}component "${componentName.replace(
                '/index',
                ''
              )}" ...\``,
              line: node.params[0].loc && node.params[0].loc.start.line,
              column: node.params[0].loc && node.params[0].loc.start.column,
              source: sourceForNode(node.params[0]),
            });
          }
        }
      }
    }

    return {
      ElementNode(node) {
        lintIndexUsage(node);
      },
      MustacheStatement(node) {
        lintIndexUsage(node);
      },
      SubExpression(node) {
        lintIndexUsage(node);
      },
    };
  }
};

/* eslint-env node */
'use strict';

const Rule = require('./base');

/*
  Don't allow dot(s) at the end of a Path expression.

  Bad

  {{contact.contact_name.}}

  {{#if contact.contact_name.}}
    {{displayName}}
  {{/if}}

  {{if contact.contact_name..}}
    {{displayName}}
  {{/if}}


  Good

  {{contact.contact_name}}

  {{#if contact.contact_name}}
    {{displayName}}
  {{/if}}

  {{if contact.contact_name}}
    {{displayName}}
  {{/if}}
*/

module.exports = class NoTrailingDotOnPathExpression extends Rule {

  findPathExpressionWithTrailingDot(node) {
    return node.params.find((param) => param.type === 'PathExpression' && param.original.endsWith('.')) ||
    node.hash.pairs.find((param) => param.type === 'PathExpression' && param.original.endsWith('.'));
  }

  visitor() {
    return {
      MustacheStatement(node) {
        let pathExpression = this.findPathExpressionWithTrailingDot(node);
        if (pathExpression) {
          let source = this.sourceForNode(node);
          this.log({
            message: 'A MustacheStatement should not have a Path Expression with a trialing dot.',
            line: pathExpression.loc && pathExpression.loc.start.line,
            column: pathExpression.loc && pathExpression.loc.start.column,
            source
          });
        }
      },

      SubExpression(node) {
        let pathExpression = this.findPathExpressionWithTrailingDot(node);
        if (pathExpression) {
          let source = this.sourceForNode(node);
          this.log({
            message: 'A SubExpression should not have a Path Expression with a trialing dot.',
            line: pathExpression.loc && pathExpression.loc.start.line,
            column: pathExpression.loc && pathExpression.loc.start.column,
            source
          });
        }
      },

      BlockStatement(node) {
        let pathExpression = this.findPathExpressionWithTrailingDot(node);
        if (pathExpression) {
          // Since we are processing only the hash pairs and params, its enough to display the open-invocation.
          let sourceLoc = {
            start: node.loc.start,
            end: node.program.loc.start
          };
          let source = this.sourceForNode({ loc: sourceLoc });
          this.log({
            message: 'A BlockStatement should not have a Path Expression with a trialing dot.',
            line: pathExpression.loc && pathExpression.loc.start.line,
            column: pathExpression.loc && pathExpression.loc.start.column,
            source
          });
        }
      }
    };
  }
};

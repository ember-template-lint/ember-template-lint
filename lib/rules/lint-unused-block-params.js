'use strict';

/*
 Disallows unused block params

  Good:

  ```
  {{#each users as |user|}}
    {{user.name}}
  {{/each}}
  ```

  Good:

  ```
  {{#each users as |user index|}}
    {{index}} {{user.name}}
  {{/each}}
  ```

  Good:

  ```
  {{#each users as |user index|}}
    {{index}}
  {{/each}}
  ```

  Bad:

  ```
  {{#each users as |user index|}}
    {{user.name}}
  {{/each}}
  ```

  The following values are valid configuration:

    * boolean -- `true` for enabled / `false` for disabled
*/

const Rule = require('./base');
const Scope = require('./internal/scope');

module.exports = class UnusedBlockParams extends Rule {
  visitor() {
    let scope = new Scope();

    return {
      BlockStatement: {
        enter(node) {
          scope.pushFrame(node);
        },
        exit(node) {
          let unusedLocal = scope.frameHasUnusedBlockParams();
          if (unusedLocal) {
            this.log({
              message: `'${unusedLocal}' is defined but never used`,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node)
            });
          }
          scope.popFrame();
        }
      },

      PathExpression(node) {
        scope.usePath(node);
      },

      MustacheStatement(node) {
        if (node.path.original === 'partial') {
          scope.usePartial();
        }
      },
    };
  }
};

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

import Rule from './_base.js';

function usedParams(node, unusedLocal) {
  let used = node.blockParams.filter((blockParam) => {
    return !unusedLocal.includes(blockParam);
  });
  console.log(
    '\nPARAMS',
    node.blockParams,
    '\nUNUSED',
    unusedLocal,
    '\nUSED',
    used,
    '\n< />',
    node.selfClosing
  );

  if (used.length > 0 || node.selfClosing) {
    console.log('do it');
    node.blockParams = used;
  }
}

export default class NoUnusedBlockParams extends Rule {
  visitor() {
    return {
      Block: {
        exit(node) {
          let unusedLocal = this.scope.frameHasUnusedBlockParams();
          if (unusedLocal) {
            if (this.mode === 'fix') {
              usedParams(node, unusedLocal);
            } else {
              this.log({
                message: `'${unusedLocal}' is defined but never used`,
                node,
                isFixable: true,
              });
            }
          }
        },
      },

      ElementNode: {
        keys: {
          children: {
            exit(node) {
              let unusedLocal = this.scope.frameHasUnusedBlockParams();
              if (unusedLocal) {
                if (this.mode === 'fix') {
                  let used = node.blockParams.filter((blockParam) => {
                    return !unusedLocal.includes(blockParam);
                  });
                  console.log(
                    '\nPARAMS',
                    node.blockParams,
                    '\nUNUSED',
                    unusedLocal,
                    '\nUSED',
                    used,
                    '\n< />',
                    node.selfClosing
                  );

                  node.blockParams = used;
                } else {
                  this.log({
                    message: `'${unusedLocal}' is defined but never used`,
                    node,
                    isFixable: true,
                  });
                }
              }
            },
          },
        },
      },

      MustacheStatement(node) {
        if (node.path.original === 'partial') {
          console.log('MEOW');
          this.scope.usePartial();
        }
      },
    };
  }
}

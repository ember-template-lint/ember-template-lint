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

module.exports = class UnusedBlockParams extends Rule {
  visitors() {
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
      }
    };
  }
};

class Frame {
  constructor(locals) {
    this.locals = locals;
    this.usedLocals = {};

    for (let i = 0; i < locals.length; i++) {
      this.usedLocals[locals[i]] = false;
    }
  }

  useLocal(name) {
    if (name in this.usedLocals) {
      this.usedLocals[name] = true;
      return true;
    } else {
      return false;
    }
  }

  unusedLocals() {
    if (this.locals.length > 0) {
      if (!this.usedLocals[this.locals[this.locals.length - 1]]) {
        return this.locals[this.locals.length - 1];
      }
    } else {
      return false;
    }
  }
}

class Scope {
  constructor() {
    this.frames = [];
  }

  pushFrame(block) {
    this.frames.push(new Frame(block.program.blockParams));
  }

  popFrame() {
    this.frames.pop();
  }

  frameHasUnusedBlockParams() {
    return this.frames[this.frames.length - 1].unusedLocals();
  }

  usePath(path) {
    let name = path.parts[0];

    for (let i = this.frames.length - 1; i >= 0; i--) {
      if (this.frames[i].useLocal(name)) {
        break;
      }
    }
  }
}

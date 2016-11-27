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

var buildPlugin = require('./base');

module.exports = function(addonContext) {
  var UnusedBlockParams = buildPlugin(addonContext, 'unused-block-params');

  UnusedBlockParams.prototype.visitors = function() {
    var scope = new Scope();

    return {
      Program: {
        enter: function(node) {
          scope.pushFrame(node);
        },
        exit: function(node) {
          var unusedLocal = scope.frameHasUnusedBlockParams();
          if (unusedLocal) {
            this.log({
              message: '\'' + unusedLocal + '\' is defined but never used',
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node)
            });
          }
          scope.popFrame();
        }
      },

      PathExpression: function(node) {
        scope.usePath(node);
      }
    };
  };

  return UnusedBlockParams;
};

function Frame(locals) {
  this.locals = locals;
  this.usedLocals = {};

  for (var i = 0; i < locals.length; i++) {
    this.usedLocals[locals[i]] = false;
  }
}

Frame.prototype.useLocal = function(name) {
  if (name in this.usedLocals) {
    this.usedLocals[name] = true;
    return true;
  } else {
    return false;
  }
};

Frame.prototype.unusedLocals = function() {
  if (this.locals.length > 0) {
    if (!this.usedLocals[this.locals[this.locals.length - 1]]) {
      return this.locals[this.locals.length - 1];
    }
  } else {
    return false;
  }
};

function Scope() {
  this.frames = [];
}

Scope.prototype.pushFrame = function(program) {
  this.frames.push(new Frame(program.blockParams));
};

Scope.prototype.popFrame = function() {
  this.frames.pop();
};

Scope.prototype.frameHasUnusedBlockParams = function() {
  return this.frames[this.frames.length - 1].unusedLocals();
};

Scope.prototype.usePath = function(path) {
  var name = path.parts[0];

  for (var i = this.frames.length - 1; i >= 0; i--) {
    if (this.frames[i].useLocal(name)) {
      break;
    }
  }
};

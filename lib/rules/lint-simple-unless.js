'use strict';

const Rule = require('./base');

const messages = {
  followingElseBlock: 'Using an {{else}} block with {{unless}} should be avoided.',
  asElseUnlessBlock: 'Using an `{{else unless}}` block should be avoided.',
  withHelper: 'Using {{unless}} in combination with other helpers should be avoided.'
};

module.exports = class LintSimpleUnless extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.original === 'unless' && node.params[0].path) {
          this._withHelper(node);
        }
      },

      BlockStatement(node) {
        let nodeInverse = node.inverse;
        let nodePathOriginal = node.path.original;

        if (nodeInverse) {
          if (nodePathOriginal === 'unless') {
            if (nodeInverse.body[0].path) {
              this._followingElseIfBlock(node);
            } else {
              this._followingElseBlock(node);
            }
          } else if (nodePathOriginal === 'if') {
            if (nodeInverse.body[0].path && nodeInverse.body[0].path.original  === 'unless') {
              this._asElseUnlessBlock(node);
            }
          }
        } else if (nodePathOriginal === 'unless' && node.params[0].path) {
          this._withHelper(node);
        }
      }
    };
  }

  _followingElseBlock(block) {
    let loc = block.program.loc.end;
    let actual = '{{else}}';

    this._logMessage(messages.followingElseBlock, loc.line, loc.column, actual);
  }

  _followingElseIfBlock(block) {
    let inverse = block.inverse;
    let loc = block.program.loc.end;
    let parameter = inverse.body[0].params[0].original;
    let actual = `{{else if ${parameter}}}`;

    this._logMessage(messages.followingElseBlock, loc.line, loc.column, actual);
  }

  _asElseUnlessBlock(block) {
    let inverse = block.inverse;
    let loc = inverse.body[0].loc.start;
    let actual = '{{else unless ...';

    this._logMessage(messages.asElseUnlessBlock, loc.line, loc.column, actual);
  }

  _withHelper(node) {
    let loc = node.params[0].loc.start;
    let actual = `{{unless (${node.params[0].path.original} ...`;

    this._logMessage(messages.withHelper, loc.line, loc.column, actual);
  }

  _logMessage(message, line, column, actual) {
    return this.log({
      message: message,
      line: line,
      column: column,
      source: actual
    });
  }
};

module.exports.messages = messages;

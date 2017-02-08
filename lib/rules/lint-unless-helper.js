'use strict';

const buildPlugin = require('./base');

const messages = {
  followingElseBlock: 'Using an {{else}} block with {{unless}} should be avoided.',
  asElseUnlessBlock: 'Using an `{{else unless}}` block should be avoided.',
  withHelper: 'Using {{unless}} in combination with other helpers should be avoided.'
};

module.exports = function(addonContext) {
  return class Plugin extends buildPlugin(addonContext, 'unless-helper') {
    visitors() {
      return {
        MustacheStatement(node) {
          if (node.params[0].path) {
            this._withHelper(node);
          }
        },

        BlockStatement(node) {
          let nodeInverse = node.inverse;
          let nodePathOriginal = node.path.original;

          if (nodeInverse) {
            if (nodePathOriginal === 'unless') {
              if (nodeInverse.body[0].path) {
                this._followingElseIfBlock(nodeInverse);
              } else {
                this._followingElseBlock(nodeInverse);
              }
            } else if (nodePathOriginal === 'if') {
              if (nodeInverse.body[0].path && nodeInverse.body[0].path.original  === 'unless') {
                this._asElseUnlessBlock(nodeInverse);
              }
            }
          } else if (nodePathOriginal === 'unless' && node.params[0].path) {
            this._withHelper(node);
          }
        }
      };
    }

    _followingElseBlock(inverse) {
      let loc = inverse.loc;
      let actual = '{{else}}';

      this._logMessage(messages.followingElseBlock, loc, actual);
    }

    _followingElseIfBlock(inverse) {
      let loc = inverse.loc;
      let parameter = inverse.body[0].params[0].original;
      let actual = `{{else if ${parameter}}}`;

      this._logMessage(messages.followingElseBlock, loc, actual);
    }

    _asElseUnlessBlock(inverse) {
      let loc = inverse.body[0].loc;
      let actual = '{{else unless ...';

      this._logMessage(messages.asElseUnlessBlock, loc, actual);
    }

    _withHelper(node) {
      let loc = node.params[0].loc;
      let actual = `{{unless (${node.params[0].path.original} ...`;

      this._logMessage(messages.withHelper, loc, actual);
    }

    _logMessage(message, loc, actual) {
      return this.log({
        message: message,
        line: loc && loc.start.line,
        column: loc && loc.start.column,
        source: actual
      });
    }
  };
};

module.exports.messages = messages;

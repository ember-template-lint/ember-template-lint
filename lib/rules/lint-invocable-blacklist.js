'use strict';

const Rule = require('./base');
const Scope = require('./internal/scope');
const createErrorMessage = require('../helpers/create-error-message');

module.exports = class InvocableBlacklist extends Rule {
  parseConfig(config) {
    switch (typeof config) {
    case 'boolean':
      if (!config) {
        return false;
      }
      break;
    case 'object':
      if (Array.isArray(config)) {
        return config;
      }
      break;
    case 'undefined':
      return false;
    }

    let errorMessage = createErrorMessage(this.ruleName, [
      '  * array of strings - helpers or components to blacklist'
    ], config);

    throw new Error(errorMessage);
  }

  visitor() {
    this._scope = new Scope();

    return {
      BlockStatement: {
        enter(node) {
          this._scope.pushFrame(node.program.blockParams);
          this._checkBlacklist(node);
        },
        exit() {
          this._scope.popFrame();
        }
      },

      MustacheStatement(node) {
        this._checkBlacklist(node);
      },

      SubExpression(node) {
        this._checkBlacklist(node);
      }
    };
  }

  _checkBlacklist(node) {
    let blacklist = this.config;
    for (let name of blacklist) {
      this._checkNode(node, name);
    }
  }

  _checkNode(node, name) {
    if ((node.path.original === name ||
        checkForComponentHelper(node, name)) &&
        !this._scope.isLocal(node.path)) {
      this._logNode(node, name);
    }
  }

  _logNode(node, name) {
    this.log({
      message: `Cannot use blacklisted helper or component '{{${name}}}'`,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node)
    });
  }
};

function checkForComponentHelper(node, name) {
  return node.path.original === 'component' &&
  node.params[0] && node.params[0].original === name;
}

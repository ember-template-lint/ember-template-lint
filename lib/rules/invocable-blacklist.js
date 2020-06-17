'use strict';

const Rule = require('./base');
const createErrorMessage = require('../helpers/create-error-message');
const dasherize = require('../helpers/dasherize-component-name');

function isValidComponentOrHelperName(str) {
  // Ensure names are passed as kebab-case strings.
  return typeof str === 'string' && str.length > 0 && dasherize(str) === str;
}

function isValidCustomErrorMessage(str) {
  return typeof str === 'string' && str.length > 0;
}

module.exports = class InvocableBlacklist extends Rule {
  parseConfig(config) {
    switch (typeof config) {
      case 'boolean':
        if (!config) {
          return false;
        }
        break;
      case 'object':
        if (
          Array.isArray(config) &&
          config.length > 0 &&
          config.every(
            (item) =>
              (typeof item === 'string' && isValidComponentOrHelperName(item)) ||
              (typeof item === 'object' &&
                Array.isArray(item.names) &&
                item.names.length > 0 &&
                item.names.every(isValidComponentOrHelperName) &&
                isValidCustomErrorMessage(item.message))
          )
        ) {
          return config;
        }
        break;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  One of these:',
        '  * string[] - helpers or components to blacklist (using kebab-case names like `nested-scope/component-name`)',
        '  * object[] - with the following keys:',
        '    * `names` - string[] - helpers or components to blacklist (using kebab-case names like `nested-scope/component-name`)',
        '    * `message` - string - custom error message to report for violations',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    let checkBlacklist = (node) => {
      let blacklist = this.config;

      for (let blacklistItem of blacklist) {
        if (typeof blacklistItem === 'object') {
          for (let name of blacklistItem.names) {
            this._checkNode(node, name, blacklistItem.message);
          }
        } else {
          this._checkNode(node, blacklistItem);
        }
      }
    };

    return {
      BlockStatement: checkBlacklist,
      ElementNode: checkBlacklist,
      MustacheStatement: checkBlacklist,
      SubExpression: checkBlacklist,
    };
  }

  _checkNode(node, name, message) {
    if (this.isLocal(node)) {
      return;
    }

    if (node.type === 'ElementNode') {
      if (dasherize(node.tag) === name || node.tag === name) {
        this._logNode(node, `<${node.tag} />`, message);
      }
    } else {
      if (node.path.original === name || checkForComponentHelper(node, name)) {
        this._logNode(node, `{{${name}}}`, message);
      }
    }
  }

  _logNode(node, name, message) {
    this.log({
      message: message || `Cannot use blacklisted helper or component '${name}'`,
      line: node.loc && node.loc.start.line,
      column: node.loc && node.loc.start.column,
      source: this.sourceForNode(node),
    });
  }
};

function checkForComponentHelper(node, name) {
  return node.path.original === 'component' && node.params[0] && node.params[0].original === name;
}

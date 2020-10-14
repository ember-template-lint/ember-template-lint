'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./base');

const messages = {
  followingElseBlock: 'Using an {{else}} block with {{unless}} should be avoided.',
  asElseUnlessBlock: 'Using an `{{else unless}}` block should be avoided.',
  withHelper: 'Using {{unless}} in combination with other helpers should be avoided.',
};

const DEFAULT_CONFIG = {
  allowlist: [],
  denylist: [],
  whitelist: [],
  blacklist: [],
  maxHelpers: 0,
};

function isValidConfigObjectFormat(config) {
  for (let key in DEFAULT_CONFIG) {
    let value = config[key];
    let valueIsArray = Array.isArray(value);

    if (value === undefined) {
      config[key] = DEFAULT_CONFIG[key];
    } else if (['whitelist', 'blacklist', 'allowlist', 'denylist'].includes(key) && !valueIsArray) {
      return false;
    }
  }

  return true;
}

module.exports = class SimpleUnless extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        // if `true` use `DEFAULT_CONFIG`
        return config ? DEFAULT_CONFIG : false;
      case 'object':
        if (isValidConfigObjectFormat(config)) {
          return config;
        }
        break;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean -- `true` for enabled / `false` for disabled\n' +
          '  * object --\n' +
          "    *  `allowlist` -- array - `['or']` for specific helpers / `[]` for wildcard\n" +
          "    *  `denylist` -- array - `['or']` for specific helpers / `[]` for none\n" +
          '    *  `maxHelpers` -- number - use -1 for no limit',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      MustacheStatement(node) {
        if (node.path.original === 'unless' && node.params[0].path) {
          this._withHelper(node);
        }
      },

      BlockStatement(node) {
        const nodeInverse = node.inverse;

        if (nodeInverse) {
          if (AstNodeInfo.isUnless(node)) {
            if (nodeInverse.body[0] && AstNodeInfo.isIf(nodeInverse.body[0])) {
              this._followingElseIfBlock(node);
            } else {
              this._followingElseBlock(node);
            }
          } else if (this._isElseUnlessBlock(nodeInverse.body[0])) {
            this._asElseUnlessBlock(node);
          }
        } else if (AstNodeInfo.isUnless(node) && node.params[0].path) {
          this._withHelper(node);
        }
      },
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
    let { whitelist, blacklist, allowlist: allow, denylist: deny, maxHelpers } = this.config;
    let params;
    let nextParams = node.params;
    let helperCount = 0;
    let containsSubExpression = false;

    let allowlist =
      [allow, whitelist].find((list) => {
        return Array.isArray(list) && list.length;
      }) || [];

    let denylist =
      [deny, blacklist].find((list) => {
        return Array.isArray(list) && list.length;
      }) || [];

    do {
      params = nextParams;
      nextParams = [];

      params.forEach((param) => {
        if (param.type === 'SubExpression') {
          if (++helperCount > maxHelpers && maxHelpers > -1) {
            let loc = param.loc.start;
            let actual = `{{unless ${helperCount > 1 ? '(... ' : ''}(${param.path.original} ...`;
            let message = `${messages.withHelper} MaxHelpers: ${maxHelpers}`;

            this._logMessage(message, loc.line, loc.column, actual);
          }

          if (allowlist.length > 0 && !allowlist.includes(param.path.original)) {
            let loc = param.loc.start;
            let actual = `{{unless ${helperCount > 1 ? '(... ' : ''}(${param.path.original} ...`;
            let message = `${messages.withHelper} Allowed helper${
              allowlist.length > 1 ? 's' : ''
            }: ${allowlist.toString()}`;

            this._logMessage(message, loc.line, loc.column, actual);
          }

          if (denylist.length > 0 && denylist.includes(param.path.original)) {
            let loc = param.loc.start;
            let actual = `{{unless ${helperCount > 1 ? '(... ' : ''}(${param.path.original} ...`;
            let message = `${messages.withHelper} Restricted helper${
              denylist.length > 1 ? 's' : ''
            }: ${denylist.toString()}`;

            this._logMessage(message, loc.line, loc.column, actual);
          }

          param.params.forEach((param) => nextParams.push(param)); // nextParams.push(...param.params);
        }
      });

      containsSubExpression = nextParams.some((param) => param.type === 'SubExpression');
    } while (containsSubExpression);
  }

  _isElseUnlessBlock(node) {
    return (
      node &&
      node.path &&
      node.path.original === 'unless' &&
      this.sourceForNode(node).startsWith('{{else ')
    );
  }

  _logMessage(message, line, column, source) {
    return this.log({
      message,
      line,
      column,
      source,
    });
  }
};

module.exports.messages = messages;

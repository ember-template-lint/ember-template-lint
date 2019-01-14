'use strict';

const Rule = require('./base');
const createErrorMessage = require('../helpers/create-error-message');

const messages = {
  followingElseBlock: 'Using an {{else}} block with {{unless}} should be avoided.',
  asElseUnlessBlock: 'Using an `{{else unless}}` block should be avoided.',
  withHelper: 'Using {{unless}} in combination with other helpers should be avoided.',
};

const DEFAULT_CONFIG = {
  whitelist: [],
  maxHelpers: 0,
};

function isValidConfigObjectFormat(config) {
  for (let key in DEFAULT_CONFIG) {
    let value = config[key];
    let valueIsArray = Array.isArray(value);

    if (value === undefined) {
      config[key] = DEFAULT_CONFIG[key];
    } else if (key === 'whitelist' && !valueIsArray) {
      return false;
    }
  }

  return true;
}

module.exports = class LintSimpleUnless extends Rule {
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
          "    *  `whitelist` -- array - `['or']` for specific helpers / `[]` for wildcard\n" +
          '    *  `maxHelpers` -- number',
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
        let nodeInverse = node.inverse;
        let nodePathOriginal = node.path.original;

        if (nodeInverse) {
          if (nodePathOriginal === 'unless') {
            if (
              nodeInverse.body[0] &&
              nodeInverse.body[0].path &&
              nodeInverse.body[0].path.original === 'if'
            ) {
              this._followingElseIfBlock(node);
            } else {
              this._followingElseBlock(node);
            }
          } else if (nodePathOriginal === 'if' && nodeInverse.body[0]) {
            if (nodeInverse.body[0].path && nodeInverse.body[0].path.original === 'unless') {
              this._asElseUnlessBlock(node);
            }
          }
        } else if (nodePathOriginal === 'unless' && node.params[0].path) {
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
    const whitelist = this.config.whitelist; // let { whitelist, maxHelpers } = this.config;
    const maxHelpers = this.config.maxHelpers;

    let params;
    let nextParams = node.params;
    let helperCount = 0;
    let containsSubexpression = false;

    do {
      params = nextParams;
      nextParams = [];

      params.forEach(param => {
        if (param.type === 'SubExpression') {
          if (++helperCount > maxHelpers) {
            let loc = param.loc.start;
            let actual = `{{unless ${helperCount > 1 ? '(... ' : ''}(${param.path.original} ...`;
            let message = `${messages.withHelper} MaxHelpers: ${maxHelpers}`;

            this._logMessage(message, loc.line, loc.column, actual);
          }

          if (whitelist.length > 0 && whitelist.indexOf(param.path.original) === -1) {
            // whitelist.includes(param.path.original)
            let loc = param.loc.start;
            let actual = `{{unless ${helperCount > 1 ? '(... ' : ''}(${param.path.original} ...`;
            let message = `${messages.withHelper} Allowed helper${
              whitelist.length > 1 ? 's' : ''
            }: ${whitelist.toString()}`;

            this._logMessage(message, loc.line, loc.column, actual);
          }

          param.params.forEach(param => nextParams.push(param)); // nextParams.push(...param.params);
        }
      });

      containsSubexpression = nextParams.some(param => param.type === 'SubExpression');
    } while (containsSubexpression);
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

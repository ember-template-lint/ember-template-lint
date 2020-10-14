'use strict';

const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./base');

function ERROR_MESSAGE_FORBIDDEN_ELEMENTS(element) {
  return `Use of <${element}> detected. Do not use forbidden elements.`;
}

const FORBIDDEN_ELEMENTS = ['meta', 'style', 'html', 'script'];

const DEFAULT_CONFIG = {
  forbidden: FORBIDDEN_ELEMENTS,
};

function isValidConfigObjectFormat(config) {
  for (let key in config) {
    let value = config[key];
    let valueIsArray = Array.isArray(value);

    if (key === 'forbidden' && !valueIsArray) {
      return false;
    } else if (!DEFAULT_CONFIG[key]) {
      return false;
    }
  }

  return true;
}

function sanitizeConfigArray(forbidden = []) {
  return forbidden.filter(Boolean).sort((a, b) => b.length - a.length);
}

module.exports = class NoForbiddenElements extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        // if `true` use `DEFAULT_CONFIG`
        return config ? DEFAULT_CONFIG : false;
      case 'object':
        if (Array.isArray(config)) {
          return {
            forbidden: sanitizeConfigArray(config),
          };
        } else if (isValidConfigObjectFormat(config)) {
          // default any missing keys to empty values
          return {
            forbidden: sanitizeConfigArray(config.forbidden || FORBIDDEN_ELEMENTS),
          };
        }
        break;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * array -- an array of strings to forbid, default: ["meta", "style", "html", "style"]',
        '  * object -- An object with the following keys:',
        '    * `forbidden` -- An array of forbidden strings',
      ],
      config
    );

    throw new Error(errorMessage);
  }
  visitor() {
    return {
      ElementNode(node) {
        let isForbiddenElement = this.config.forbidden.includes(node.tag);
        if (isForbiddenElement) {
          this.log({
            message: ERROR_MESSAGE_FORBIDDEN_ELEMENTS(node.tag),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE_FORBIDDEN_ELEMENTS = ERROR_MESSAGE_FORBIDDEN_ELEMENTS;

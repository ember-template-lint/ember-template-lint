'use strict';

const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./_base');

const ERROR_MESSAGE =
  'Do not use HTML element event properties like `onclick`. Instead, use the `on` modifier.';

const DEFAULT_CONFIG = {
  requireActionHelper: true,
};

function isValidConfigObjectFormat(config) {
  for (let key in config) {
    let value = config[key];
    let valueType = typeof value;

    if (key === 'requireActionHelper' && valueType !== 'boolean') {
      return false;
    } else if (!(key in DEFAULT_CONFIG)) {
      return false;
    }
  }

  return true;
}

module.exports = class NoElementEventActions extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const eventProperties = node.attributes.filter(isEventPropertyWithAction.bind(this));
        for (const eventProperty of eventProperties) {
          this.log({
            message: ERROR_MESSAGE,
            node: eventProperty,
          });
        }
      },
    };
  }
};

function isDomEventAttributeName(name) {
  const nameLower = name.toLowerCase();
  return nameLower.startsWith('on') && nameLower !== 'on';
}

function isEventPropertyWithAction(node) {
  const config = parseConfig(this.config);
  return (
    node.type === 'AttrNode' &&
    isDomEventAttributeName(node.name) &&
    node.value.type === 'MustacheStatement' &&
    (!config.requireActionHelper ||
      (node.value.path.type === 'PathExpression' && node.value.path.original === 'action'))
  );
}

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

function parseConfig(config) {
  let configType = typeof config;

  switch (configType) {
    case 'boolean':
      // if `true` use `DEFAULT_CONFIG`
      return config ? DEFAULT_CONFIG : false;
    case 'object':
      if (isValidConfigObjectFormat(config)) {
        return {
          requireActionHelper:
            'requireActionHelper' in config
              ? config.requireActionHelper
              : DEFAULT_CONFIG['requireActionHelper'],
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
      '  * object -- An object with the following keys:',
      '    * `requireActionHelper` -- Only apply this rule even when the {{action}} helper is present (defaults to `true`)',
    ],
    config
  );

  throw new Error(errorMessage);
}

module.exports.parseConfig = parseConfig;

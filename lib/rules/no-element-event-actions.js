'use strict';

const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./_base');

const ERROR_MESSAGE =
  'Do not use HTML element event properties like `onclick`. Instead, use the `on` modifier.';

const DEFAULT_CONFIG = {
  actionHelperOptional: false,
};

function isValidConfigObjectFormat(config) {
  for (let key in config) {
    let value = config[key];
    let valueType = typeof value;

    if (key === 'actionHelperOptional' && valueType !== 'boolean') {
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
  return (
    node.type === 'AttrNode' &&
    isDomEventAttributeName(node.name) &&
    node.value.type === 'MustacheStatement' &&
    ((node.value.path.type === 'PathExpression' && node.value.path.original === 'action') ||
      this.config.actionHelperOptional)
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
          actionHelperOptional:
            'actionHelperOptional' in config
              ? config.actionHelperOptional
              : DEFAULT_CONFIG['actionHelperOptional'],
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
      '    * `actionHelperOptional` -- Apply this rule even when the {{action}} helper is not present',
    ],
    config
  );

  throw new Error(errorMessage);
}

module.exports.parseConfig = parseConfig;

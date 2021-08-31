'use strict';

const camelize = require('../helpers/camelize');
const createConfigErrorMessage = require('../helpers/create-error-message');
const dasherize = require('../helpers/dasherize-component-name');
const { match } = require('../helpers/node-matcher');
const Rule = require('./_base');

const FORMAT = {
  CAMEL_CASE: 'camelCase',
  KEBAB_CASE: 'kebab-case',
};

const FORMAT_METHOD = {
  [FORMAT.CAMEL_CASE]: camelize,
  [FORMAT.KEBAB_CASE]: dasherize,
};

const FORMATS = Object.values(FORMAT);
const DEFAULT_FORMAT = FORMAT.CAMEL_CASE;

module.exports = class RequireValidNamedBlockNamingFormat extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        return config ? DEFAULT_FORMAT : false;
      case 'string':
        if (FORMATS.includes(config)) {
          return config;
        }
        break;
      case 'undefined':
        return false;
    }

    let errorMessage = createConfigErrorMessage(
      this.ruleName,
      FORMATS.map(
        (format) => `  * "${format}" - Requires the use of the "${format}" naming format.`
      ),
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      MustacheStatement(node) {
        if (isHasBlockNode(node)) {
          this._checkHasBlockNode(node);
        } else if (isYieldNode(node)) {
          this._checkYieldNode(node);
        }
      },

      SubExpression(node) {
        if (isHasBlockNode(node)) {
          this._checkHasBlockNode(node);
        }
      },
    };
  }

  _checkHasBlockNode(node) {
    let nameArgument = node.params[0];

    if (nameArgument && nameArgument.type === 'StringLiteral') {
      this._checkNamedBlockName(nameArgument.original, nameArgument);
    }
  }

  _checkYieldNode(node) {
    let toArgument = node.hash.pairs.find((pair) => pair.key === 'to');

    if (toArgument && toArgument.value.type === 'StringLiteral') {
      this._checkNamedBlockName(toArgument.value.original, toArgument);
    }
  }

  _checkNamedBlockName(name, node) {
    let formatMethod = FORMAT_METHOD[this.config];
    let requiredName = formatMethod(name);

    if (name !== requiredName) {
      this.log({
        message: createErrorMessage(this.config, name, requiredName),
        node,
      });
    }
  }
};

function isHasBlockNode(node) {
  return (
    match(node.path, { original: 'has-block', type: 'PathExpression' }) ||
    match(node.path, { original: 'has-block-params', type: 'PathExpression' })
  );
}

function isYieldNode(node) {
  return match(node.path, { original: 'yield', type: 'PathExpression' });
}

function createErrorMessage(format, from, to) {
  return `Named blocks are required to use the "${format}" naming format. Please change "${from}" to "${to}".`;
}

module.exports.FORMAT = FORMAT;
module.exports.createErrorMessage = createErrorMessage;

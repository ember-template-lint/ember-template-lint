'use strict';

const ariaQuery = require('aria-query');

const Rule = require('./_base');

const VALID_ARIA_ATTRIBUTES = ariaQuery.aria;

function createInvalidAriaAttributeMessage(name) {
  return `${name} is not a valid ARIA attribute.`;
}

function createInvalidAttributeTypeErrorMessage(name, type, permittedValues) {
  switch (type) {
    case 'tristate':
      return `The value for ${name} must be a boolean or the string "mixed".`;
    case 'token':
      return `The value for ${name} must be a single token from the following: ${permittedValues}.`;
    case 'tokenlist':
      return `The value for ${name} must be a list of one or more tokens from the following: ${permittedValues}.`;
    case 'idlist':
      return `The value for ${name} must be a list of strings that represent DOM element IDs (idlist)`;
    case 'id':
      return `The value for ${name} must be a string that represents a DOM element ID`;
    default:
      return `The value for ${name} must be a ${type}.`;
  }
}

function isBoolean(value) {
  return typeof value === 'boolean' || value === 'true' || value === 'false';
}

function isValidValue(expectedType, permittedValues, value) {
  switch (expectedType) {
    case 'boolean':
      return isBoolean(value);
    case 'string':
    case 'id':
      return typeof value === 'string';
    case 'tristate':
      return isBoolean(value) || value === 'mixed';
    case 'integer':
    case 'number':
      return !Number.isNaN(value);
    case 'token':
      return typeof value === 'string' && permittedValues.includes(value);
    case 'idlist':
      return (
        typeof value === 'string' &&
        value.split(' ').every((token) => isValidValue('id', [], token))
      );
    case 'tokenlist':
      return (
        typeof value === 'string' &&
        value.split(' ').every((token) => permittedValues.includes(token.toLowerCase()))
      );
    default:
      return false;
  }
}

module.exports = class NoInvalidAriaAttributes extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      node,
    });
  }

  visitor() {
    return {
      ElementNode(node) {
        for (const attribute of node.attributes) {
          let attributeName = attribute.name;
          if (attributeName.startsWith('aria-')) {
            if (!VALID_ARIA_ATTRIBUTES.has(attributeName)) {
              this.logNode({
                message: createInvalidAriaAttributeMessage(attributeName),
                node,
              });
              return;
            }
            let validAriaAttribute = VALID_ARIA_ATTRIBUTES.get(attributeName);
            let expectedType = validAriaAttribute.type;
            let permittedValues = validAriaAttribute.values;
            let allowUndefined = validAriaAttribute.allowundefined || false;
            let value = attribute.value.chars;
            if (
              (value === 'undefined' && !allowUndefined) ||
              !isValidValue(expectedType, permittedValues, value)
            ) {
              this.logNode({
                message: createInvalidAttributeTypeErrorMessage(
                  attribute.name,
                  expectedType,
                  permittedValues
                ),
                node,
              });
            }
          }
        }
      },
    };
  }
};

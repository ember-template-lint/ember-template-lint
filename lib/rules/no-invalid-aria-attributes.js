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
      return `The value for ${name} must be a single token from the following: ${permittedValues.join(
        ', '
      )}.`;
    case 'tokenlist':
      return `The value for ${name} must be a list of one or more tokens from the following: ${permittedValues.join(
        ', '
      )}.`;
    case 'idlist':
      return `The value for ${name} must be a list of strings that represent DOM element IDs (idlist)`;
    case 'id':
      return `The value for ${name} must be a string that represents a DOM element ID`;
    case 'integer':
      return `The value for ${name} must be an integer.`;
    default:
      return `The value for ${name} must be a ${type}.`;
  }
}

function isBoolean(value) {
  return typeof value === 'boolean' || value === 'true' || value === 'false';
}

function isNumeric(value) {
  if (isBoolean(value)) {
    return false;
  } else if (typeof value === 'number') {
    return !Number.isNaN(value);
  } else if (typeof value === 'string') {
    return !Number.isNaN(Number.parseInt(value, 10));
  } else {
    return false;
  }
}

function validityCheck(expectedType, permittedValues, allowUndefined, value) {
  if (value === 'undefined' && !allowUndefined) {
    return false;
  }
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
      return isNumeric(value);
    case 'token':
      return typeof value === 'string' && permittedValues.includes(value);
    case 'idlist':
      return (
        typeof value === 'string' &&
        value.split(' ').every((token) => validityCheck('id', [], false, token))
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

function getValuesFromMustache(mustacheNode) {
  let valuesList = [];
  if (['NumberLiteral', 'StringLiteral'].includes(mustacheNode.path.type)) {
    valuesList.push(mustacheNode.path);
  } else if (mustacheNode.path.type === 'PathExpression') {
    if (mustacheNode.path.original === 'if' || mustacheNode.path.original === 'unless') {
      if (mustacheNode.params.length === 2 || mustacheNode.params.length === 3) {
        valuesList.push(mustacheNode.params[1].value);
      }
      if (mustacheNode.params.length === 3) {
        valuesList.push(mustacheNode.params[2].value);
      }
    }
  }
  return valuesList;
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
        let foundAriaAttributes = [];
        for (const attribute of node.attributes) {
          if (attribute.name.startsWith('aria-')) {
            if (!VALID_ARIA_ATTRIBUTES.has(attribute.name)) {
              this.logNode({
                message: createInvalidAriaAttributeMessage(attribute.name),
                node,
              });
              return;
            } else {
              foundAriaAttributes.push(attribute);
            }
          }
        }
        for (let attribute of foundAriaAttributes) {
          let validAriaAttribute = VALID_ARIA_ATTRIBUTES.get(attribute.name);
          let expectedType = validAriaAttribute.type;
          let permittedValues = validAriaAttribute.values;
          let allowUndefined = validAriaAttribute.allowundefined || false;
          let isValidValue;
          if (attribute.value.type === 'MustacheStatement') {
            if (attribute.value.path) {
              let valuesList = getValuesFromMustache(attribute.value);
              if (valuesList.length === 0) {
                isValidValue = true;
              } else {
                for (let value of valuesList) {
                  isValidValue = validityCheck(
                    expectedType,
                    permittedValues,
                    allowUndefined,
                    value
                  );
                }
              }
            }
          } else {
            isValidValue = validityCheck(
              expectedType,
              permittedValues,
              allowUndefined,
              attribute.value.chars
            );
          }
          if (!isValidValue) {
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
      },
    };
  }
};

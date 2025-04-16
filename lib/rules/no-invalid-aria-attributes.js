import { aria } from 'aria-query';

import Rule from './_base.js';

const VALID_ARIA_ATTRIBUTES = aria;

function createInvalidAriaAttributeMessage(name) {
  return `${name} is an unrecognized ARIA attribute.`;
}

function createInvalidAttributeTypeErrorMessage(name, type, permittedValues) {
  switch (type) {
    case 'tristate': {
      return `The value for ${name} must be a boolean or the string "mixed".`;
    }
    case 'token': {
      return `The value for ${name} must be a single token from the following: ${permittedValues.join(
        ', '
      )}.`;
    }
    case 'tokenlist': {
      return `The value for ${name} must be a list of one or more tokens from the following: ${permittedValues.join(
        ', '
      )}.`;
    }
    case 'idlist': {
      return `The value for ${name} must be a list of strings that represent DOM element IDs (idlist)`;
    }
    case 'id': {
      return `The value for ${name} must be a string that represents a DOM element ID`;
    }
    case 'integer': {
      return `The value for ${name} must be an integer.`;
    }
    default: {
      return `The value for ${name} must be a ${type}.`;
    }
  }
}

function isBoolean(value) {
  return typeof value === 'boolean' || value === 'true' || value === 'false';
}

function isNumeric(value) {
  if (typeof value === 'string') {
    value = Number.parseInt(value, 10);
  }
  return !isBoolean(value) && !Number.isNaN(value);
}

/**
 * Converts all true/false values in a list of permitted values to strings,
 * since they are stored as booleans by default
 */
function convertToStrings(permittedValues) {
  for (let i = 0; i < permittedValues.length; i++) {
    let currentVal = permittedValues[i];
    permittedValues[i] = typeof currentVal === 'boolean' ? currentVal.toString() : currentVal;
  }
  return permittedValues;
}

function validityCheck(expectedType, permittedValues, allowUndefined, value) {
  if (value === 'undefined') {
    return allowUndefined;
  }
  switch (expectedType) {
    case 'boolean': {
      return isBoolean(value);
    }
    case 'string':
    case 'id': {
      return typeof value === 'string' && !isBoolean(value);
    }
    case 'idlist': {
      return (
        typeof value === 'string' &&
        value.split(' ').every((token) => validityCheck('id', [], false, token))
      );
    }
    case 'tristate': {
      return isBoolean(value) || value === 'mixed';
    }
    case 'integer':
    case 'number': {
      return isNumeric(value);
    }
    case 'token': {
      return typeof value === 'string' && convertToStrings(permittedValues).includes(value);
    }
    case 'tokenlist': {
      return (
        typeof value === 'string' &&
        value.split(' ').every((token) => permittedValues.includes(token.toLowerCase()))
      );
    }
  }
}

export default class NoInvalidAriaAttributes extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let foundAriaAttributes = [];
        for (const attribute of node.attributes) {
          if (attribute.name.startsWith('aria-')) {
            if (VALID_ARIA_ATTRIBUTES.has(attribute.name)) {
              foundAriaAttributes.push(attribute);
            } else {
              this.log({
                message: createInvalidAriaAttributeMessage(attribute.name),
                node,
              });
              return;
            }
          }
        }
        for (let attribute of foundAriaAttributes) {
          let validAriaAttribute = VALID_ARIA_ATTRIBUTES.get(attribute.name);
          let expectedType = validAriaAttribute.type;
          let permittedValues = validAriaAttribute.values;
          let allowUndefined = validAriaAttribute.allowundefined || false;
          let isValidValue;
          // Skip validation for interpolated string values
          if (
            attribute.value.type === 'MustacheStatement' ||
            attribute.value.type === 'ConcatStatement'
          ) {
            return;
          } else {
            isValidValue = validityCheck(
              expectedType,
              permittedValues,
              allowUndefined,
              attribute.value.chars
            );
          }
          if (!isValidValue) {
            this.log({
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
}

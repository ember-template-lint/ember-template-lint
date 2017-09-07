'use strict';

/*
 Enforce template size constraints

 The following values are valid configuration:

   * boolean -- `true` for enabled (defaults of max: 200 / min: 5) / `false` for disabling this rule
   * object --
     * max {number} - the longest a template should be without failing a test (assuming the
       right thing to do would be to split the template up into pieces).
     * min {number} - the shortest a template should be without failing a test (assuming the
       right thing to do would be to inline the template).
 */

const Rule = require('./base');

const DEFAULT_MAX_LENGTH = 200;
const DEFAULT_MIN_LENGTH = 5;

const DEFAULT_CONFIG = {
  max: DEFAULT_MAX_LENGTH,
  min: DEFAULT_MIN_LENGTH
};

function isValidConfigObjectFormat(config) {
  for (let key in config) {
    let value = config[key];
    let valueIsInteger = Number.isInteger(value);

    if (key === 'min' && !valueIsInteger) {
      return false;
    } else if (key === 'max' && !valueIsInteger) {
      return false;
    }
  }
  return true;
}

module.exports = class LengthValidation extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    let errorMessage = 'The template-length rule accepts one of the following values.\n ' +
      '  * boolean - `true` to enable / `false` to disable\n' +
      '  * object -- An object with the following keys:' +
      '    * `min` -- Minimum length of a template ' +
      '    * `max` -- Maximum length of a template. ' +
      '\nYou specified `' + JSON.stringify(config) + '`';

    switch (configType) {
    case 'boolean':
      // if `true` use `DEFAULT_CONFIG`
      return config ? DEFAULT_CONFIG : {};
    case 'object':
      if (isValidConfigObjectFormat(config)) {
        return config;
      } else {
        throw new Error(errorMessage);
      }
    case 'undefined':
      return {};
    default:
      throw new Error(errorMessage);
    }
  }

  visitor() {
    return {
      Program: {

        // implementation goes here in exit(): in the exit handler, the rule will not
        // be called if it has been disabled by any inline comments within the file.

        exit(node) {
          if (node.loc.start.line > 1 || node.loc.start.column > 0) { return; }

          if (this.config.max && this.source.length > this.config.max) {
            this.log({
              message: `Template length of ${this.source.length} exceeds ${this.config.max}`,
              line: node.loc.start.line,
              column: node.loc.start.column
            });
          } else if (this.config.min && this.source.length < this.config.min) {
            this.log({
              message: `Template length of ${this.source.length} is smaller than ${this.config.min}`,
              line: node.loc.start.line,
              column: node.loc.start.column
            });
          }
        }
      },
    };
  }
};

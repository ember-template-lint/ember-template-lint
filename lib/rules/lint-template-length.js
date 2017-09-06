'use strict';

/*
 Enforce template size constraints

 The following values are valid configuration:

   * boolean -- `true` for enabled (same as `unix`) / `false` for disabled
   * object --
     * max {number} - the longest a template should be without failing a test (assuming the
       right thing to do would be to split the template up into pieces.
     * min {number} - the shortest a template should be without failing a test (assuming the
       right thing to do would be to inline the template.
 */

const Rule = require('./base');

const MAX_LENGTH = 100;
const MIN_LENGTH = 5;

const DEFAULT_CONFIG = {
  max: MAX_LENGTH,
  min: MIN_LENGTH,
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
      Program(node) {
        if (node.loc.start.line <= 1 && node.loc.start.column === 0 && node.loc.end.column === 0) {
          const lines = node.body.map((chunk) => {
            const source = this.sourceForNode(chunk);
            return source.split('\n').length;
          }).reduce((sum, value) => sum + value, 0);
          if (this.config.max && lines > this.config.max) {
            this.log({
              message: `Template length of ${lines} exceeds ${this.config.max}`,
              line: node.loc.start.line,
              column: node.loc.start.column
            });
          } else if (this.config.min && lines < this.config.min) {
            this.log({
              message: `Template length of ${lines} is smaller than ${this.config.min}`,
              line: node.loc.start.line,
              column: node.loc.start.column
            });
          }
        }
      },
    };
  }
};

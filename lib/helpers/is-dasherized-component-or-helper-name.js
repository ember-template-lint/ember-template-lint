'use strict';

const dasherizeComponentName = require('../helpers/dasherize-component-name');

module.exports = function (name) {
  return typeof name === 'string' && name.length > 0 && dasherizeComponentName(name) === name;
};

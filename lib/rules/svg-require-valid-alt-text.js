'use strict';

const Rule = require('./base');

// TODO Change template to the real error message that you want to report
const ERROR_MESSAGE = 'Error Message to Report';

module.exports = class SvgRequireValidAltText extends Rule {
  visitor() {}
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

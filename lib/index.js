'use strict';

module.exports = require('./linter');
module.exports.Rule = require('./rules/base');
module.exports.ASTHelpers = require('./helpers/ast-node-info');

module.exports.WARNING_SEVERITY = require('./linter').WARNING_SEVERITY;
module.exports.ERROR_SEVERITY = require('./linter').ERROR_SEVERITY;

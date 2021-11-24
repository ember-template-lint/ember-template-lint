'use strict';

// Linter class
module.exports = require('./linter');

// Rule class
module.exports.Rule = require('./rules/_base');

// Recast dependency
module.exports.recast = require('ember-template-recast');

// Helpers
module.exports.ASTHelpers = require('./helpers/ast-node-info');
module.exports.NodeMatcher = require('./helpers/node-matcher');
module.exports.generateRuleTests = require('./helpers/rule-test-harness');

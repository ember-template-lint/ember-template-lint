'use strict';

const generateRuleTests = require('../../lib/helpers/rule-test-harness');

module.exports = function(options) {
  return generateRuleTests(
    Object.assign({}, options, {
      groupMethodBefore: beforeEach,
      groupingMethod: describe,
      testMethod: test,
      focusMethod: test.only,
    })
  );
};

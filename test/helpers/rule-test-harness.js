'use strict';

const assert = require('assert');

const generateRuleTests = require('../../lib/helpers/rule-test-harness');

module.exports = function (...args) {
  assert(args.length === 1, '`generateRuleTests` should only be called with one argument.');
  const [options] = args;
  assert(
    typeof options === 'object',
    '`generateRuleTests` should only be called with an object argument.'
  );
  return generateRuleTests(
    Object.assign({}, options, {
      groupMethodBefore: beforeEach,
      groupingMethod: describe,
      testMethod: test,
      focusMethod: test.only,
    })
  );
};

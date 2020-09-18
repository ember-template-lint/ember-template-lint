'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'svg-require-valid-alt-text',

  config: true,

  // TODO update with a good example that should pass
  good: [],

  // TODO update with tests that should fail
  bad: [],
});

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-trailing-dot-in-path-expression',

  config: true,

  good: ['{{contact.contact_name}}'],
});

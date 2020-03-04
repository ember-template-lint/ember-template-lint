'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const message = require('../../../lib/rules/inline-link-to').message;

generateRuleTests({
  name: 'inline-link-to',

  config: true,

  good: [
    "{{#link-to 'routeName' prop}}Link text{{/link-to}}",
    "{{#link-to 'routeName'}}Link text{{/link-to}}",
  ],

  bad: [
    {
      template: "{{link-to 'Link text' 'routeName'}}",
      fixedTemplate: "{{#link-to 'routeName' }}Link text{{/link-to}}",

      result: {
        message,
        source: "{{link-to 'Link text' 'routeName'}}",
        line: 1,
        column: 0,
        isFixable: true,
      },
    },
    {
      template: "{{link-to 'Link text' 'routeName' one two}}",
      fixedTemplate: "{{#link-to 'routeName' one two }}Link text{{/link-to}}",

      result: {
        message,
        source: "{{link-to 'Link text' 'routeName' one two}}",
        line: 1,
        column: 0,
        isFixable: true,
      },
    },
    {
      template: "{{link-to (concat 'Hello' @username) 'routeName' one two}}",
      fixedTemplate: "{{#link-to 'routeName' one two }}{{concat 'Hello' @username }}{{/link-to}}",

      result: {
        message,
        source: "{{link-to (concat 'Hello' @username) 'routeName' one two}}",
        line: 1,
        column: 0,
        isFixable: true,
      },
    },
    {
      template: "{{link-to 1234 'routeName' one two}}",

      result: {
        message,
        source: "{{link-to 1234 'routeName' one two}}",
        line: 1,
        column: 0,
        isFixable: false,
      },
    },
  ],
});

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-trailing-dot-in-path-expression',
  skipDisabledTests: true,
  config: true,

  good: [
    '{{contact}}',
    "<span class={{if contact.is_new 'bg-success'}}>{{contact.contact_name}}</span>",
    '{{#if contact.contact_name}}\n' + '   {{displayName}}\n' + '{{/if}}',
    '{{#contact-details contact=contact}}\n' +
      '   {{contact.displayName}}\n' +
      '{{/contact-details}}',
  ],

  bad: [
    {
      template: '{{contact.}}',

      fatal: {
        fatal: true,
        severity: 2,
        message:
          "'.' is not a supported path in Glimmer; check for a path with a trailing '.' at L1:C9.",
        line: 1,
        column: 9,
        moduleId: 'layout.hbs',
      },
    },
    {
      template: "<span class={{if contact.is_new. 'bg-success'}}>{{contact.contact_name}}</span>",

      fatal: {
        fatal: true,
        severity: 2,
        message:
          "'.' is not a supported path in Glimmer; check for a path with a trailing '.' at L1:C31.",
        line: 1,
        column: 31,
        moduleId: 'layout.hbs',
      },
    },
    {
      template: '{{#if contact.contact_name.}}\n' + '   {{displayName.}}\n' + '{{/if}}',

      fatal: {
        fatal: true,
        severity: 2,
        message:
          "'.' is not a supported path in Glimmer; check for a path with a trailing '.' at L1:C26.",
        line: 1,
        column: 26,
        moduleId: 'layout.hbs',
      },
    },
    {
      template: "{{if. contact 'bg-success'}}",

      fatal: {
        fatal: true,
        severity: 2,
        message:
          "'.' is not a supported path in Glimmer; check for a path with a trailing '.' at L1:C4.",
        line: 1,
        column: 4,
        moduleId: 'layout.hbs',
      },
    },
    {
      template: '{{contact-details contact=(hash. name=name age=age)}}',

      fatal: {
        fatal: true,
        severity: 2,
        message:
          "'.' is not a supported path in Glimmer; check for a path with a trailing '.' at L1:C31.",
        line: 1,
        column: 31,
        moduleId: 'layout.hbs',
      },
    },
  ],
});

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-trailing-dot-in-path-expression',

  config: true,

  good: [
    '{{contact}}',
    '<span class={{if contact.is_new \'bg-success\'}}>{{contact.contact_name}}</span>',
    '{{#if contact.contact_name}}\n' +
    '   {{displayName}}\n' +
    '{{/if}}',
    '{{#contact-details contact=contact}}\n' +
    '   {{contact.displayName}}\n' +
    '{{/contact-details}}'
  ],

  bad: [{
    template: '{{contact.}}',
    result: {
      rule: 'no-trailing-dot-in-path-expression',
      moduleId: 'layout.hbs',
      message: 'A MustacheStatement should not have a Path Expression with a trialing dot.',
      line: 1,
      column: 9,
      source: '{{contact.}}'
    }
  }, {
    template: '<span class={{if contact.is_new. \'bg-success\'}}>{{contact.contact_name}}</span>',
    result: {
      rule: 'no-trailing-dot-in-path-expression',
      moduleId: 'layout.hbs',
      message: 'A MustacheStatement should not have a Path Expression with a trialing dot.',
      line: 1,
      column: 31,
      source: '{{if contact.is_new. \'bg-success\'}}'
    }
  }, {
    template: '{{#if contact.contact_name.}}\n' +
      '   {{displayName.}}\n' +
      '{{/if}}',

    results: [{
      column: 26,
      line: 1,
      message: 'A BlockStatement should not have a Path Expression with a trialing dot.',
      moduleId: 'layout.hbs',
      rule: 'no-trailing-dot-in-path-expression',
      source: '{{#if contact.contact_name.}}'
    }, {
      column: 16,
      line: 2,
      message: 'A MustacheStatement should not have a Path Expression with a trialing dot.',
      moduleId: 'layout.hbs',
      rule: 'no-trailing-dot-in-path-expression',
      source: '{{displayName.}}'
    }]
  }, {
    template: '{{if. contact \'bg-success\'}}',
    results: [{
      column: 4,
      line: 1,
      message: 'A MustacheStatement should not have a Path Expression with a trialing dot.',
      moduleId: 'layout.hbs',
      rule: 'no-trailing-dot-in-path-expression',
      source: '{{if. contact \'bg-success\'}}',
    }]
  }, {
    template: '{{contact-details contact=(hash. name=name age=age)}}',

    results: [{
      column: 31,
      line: 1,
      message: 'A SubExpression should not have a Path Expression with a trialing dot.',
      moduleId: 'layout.hbs',
      rule: 'no-trailing-dot-in-path-expression',
      source: '(hash. name=name age=age)',
    }]
  }]
});

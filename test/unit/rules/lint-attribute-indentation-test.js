'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'attribute-indentation',

  config: true,

  good: [
    //Non Block form with no params
    '{{contact-details}}',
    //Default config with open-invocation(< 80 chars)
    //positional params
    '{{contact-details firstName lastName}}',
    //named params
    '{{contact-details firstName=firstName lastName=lastName}}',
    //Non Block form more than the default config characters (> 80 chars)
    {
      config: {
        'open-invocation-max-len': 120
      },
      template: '{{contact-details firstName=firstName lastName=lastName avatarUrl=avatarUrl age=age address=address phoneNo=phoneNo}}'
    },
    //Open-invocation with multiple lines.
    '{{contact-details' + '\n' +
    '  firstName=firstName' + '\n' +
    '  lastName=lastName' + '\n' +
    '}}',

    //Block form within 80 characters
    //with positional params
    '{{#contact-details firstName lastName}}' + '\n' +
    ' {{contactImage}}' + '\n' +
    '{{/contact-details}}',
    //with named params
    '{{#contact-details firstName=firstName lastName=lastName}}' + '\n' +
    ' {{contactImage}}' + '\n' +
    '{{/contact-details}}',
    //with block params
    '{{#contact-details firstName=firstName lastName=lastName as |contact|}}' + '\n' +
    ' {{contact.fullName}}' + '\n' +
    '{{/contact-details}}',

    //Block form with open-invocation more than 80 characters
    {
      config: {
        'open-invocation-max-len': 120
      },
      template: '{{#contact-details firstName=firstName lastName=lastName age=age avatarUrl=avatarUrl as |contact|}}' + '\n' +
      ' {{contact.fullName}}' + '\n' +
      '{{/contact-details}}',
    },
    //Block form with multiple line invocation
    '{{#contact-details' + '\n' +
    '  firstName=firstName' + '\n' +
    '  lastName=lastName' + '\n' +
    'as |fullName|}}' + '\n' +
    '  {{fullName}}' + '\n' +
    '{{/contact-details}}',
    //Block form with no params
    '{{#contact-details' + '\n' +
    'as |contact|}}' + '\n' +
    '  {{contact.fullName}}' + '\n' +
    '{{/contact-details}}',
  ],

  bad: [{
    //Non-Block form more than 30 characters
    config: {
      'open-invocation-max-len': 30
    },
    template: '{{contact-details firstName=firstName lastName=lastName}}',
    results: [{
      'column': 18,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'firstName\' beginning at L1:C18. Expected \'firstName\' to be indentation at an of 2 but was found at 18',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{contact-details firstName=firstName lastName=lastName}}'
    }, {
      'column': 38,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'lastName\' beginning at L1:C38. Expected \'lastName\' to be indentation at an of 2 but was found at 38',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{contact-details firstName=firstName lastName=lastName}}'
    }, {
      'column': 55,
      'line': 1,
      'message': 'Incorrect indentation of close curly braces \'}}\' for the component \'{{contact-details}}\' beginning at L1:C55. Expected to be indentation at L2:C0 with an of 0 but was found at 55',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{contact-details firstName=firstName lastName=lastName}}'
    }]
  },{
    //Block form with multiple lines
    template: '{{#contact-details' + '\n' +
    ' firstName=firstName lastName=lastName as |contact|}}' + '\n' +
    ' {{contact.fullName}}' + '\n' +
    '{{/contact-details}}',
    results: [{
      'column': 1,
      'line': 2,
      'message': `Incorrect indentation of attribute 'firstName' beginning at L2:C1. Expected 'firstName' to be indentation at an of 2 but was found at 1`,
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details\n firstName=firstName lastName=lastName as |contact|}}\n {{contact.fullName}}\n{{/contact-details}}'
    }, {
      'column': 21,
      'line': 2,
      'message': 'Incorrect indentation of attribute \'lastName\' beginning at L2:C21. Expected \'lastName\' to be indentation at an of 2 but was found at 21',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details\n firstName=firstName lastName=lastName as |contact|}}\n {{contact.fullName}}\n{{/contact-details}}'
    }, {
      'column': 38,
      'line': 2,
      'message': 'Incorrect indentation of block params \'as |contact|}}\' beginning at L2:C38. Expecting the block params to be at L3:C0 with an indentation of 0 but was found at 38.',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details\n firstName=firstName lastName=lastName as |contact|}}\n {{contact.fullName}}\n{{/contact-details}}'
    }]
  }, {
    //Block form (> 80 chars)
    template: '{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}' + '\n' +
    '  {{fullName}}' + '\n' +
    '{{/contact-details}}',
    results: [{
      'column': 19,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'firstName\' beginning at L1:C19. Expected \'firstName\' to be indentation at an of 2 but was found at 19',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}\n  {{fullName}}\n{{/contact-details}}'
    }, {
      'column': 39,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'lastName\' beginning at L1:C39. Expected \'lastName\' to be indentation at an of 2 but was found at 39',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}\n  {{fullName}}\n{{/contact-details}}'
    }, {
      'column': 57,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'age\' beginning at L1:C57. Expected \'age\' to be indentation at an of 2 but was found at 57',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}\n  {{fullName}}\n{{/contact-details}}'
    }, {
      'column': 65,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'avatar\' beginning at L1:C65. Expected \'avatar\' to be indentation at an of 2 but was found at 65',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}\n  {{fullName}}\n{{/contact-details}}'
    }, {
      'column': 78,
      'line': 1,
      'message': 'Incorrect indentation of block params \'as |contact|}}\' beginning at L1:C78. Expecting the block params to be at L2:C0 with an indentation of 0 but was found at 78.',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}\n  {{fullName}}\n{{/contact-details}}'
    }]
  }, {
    //Block form with no params with multiple lines.
    template: '{{#contact-details' + '\n' +
               '\n' +
               '\n' +
              'as |contact|}}' + '\n' +
              '  {{contact.fullName}}' + '\n' +
              '{{/contact-details}}',
    results: [{
      'column': 0,
      'line': 4,
      'message': `Incorrect indentation of block params 'as |contact|}}' beginning at L4:C0. Expecting the block params to be at L2:C0 with an indentation of 0 but was found at 0.`,
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details\n\n\nas |contact|}}\n  {{contact.fullName}}\n{{/contact-details}}'
    }]

  }]
});

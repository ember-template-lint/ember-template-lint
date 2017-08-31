'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'attribute-indentation',

  config: true,

  good: [
    //Non Block form
    '{{contact-details' + '\n' +
    '  firstName=firstName' + '\n' +
    '  lastName=lastName' + '\n' +
    '}}',
    //Non Block form with no params
    '{{contact-details}}',
    //Block form
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
    '{{/contact-details}}'
  ],

  bad: [{
      //MustacheStatement
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
  }, {
      //MustacheStatement with a positional param
    template: '{{contact-details firstName lastName=lastName}}',

    results: [{
      'column': 18,
      'line': 1,
      'message': 'Incorrect indentation of positional param \'firstName\' beginning at L1:C18. Expected \'firstName\' to be indentation at an of 2 but was found at 18',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{contact-details firstName lastName=lastName}}'
    }, {
      'column': 28,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'lastName\' beginning at L1:C28. Expected \'lastName\' to be indentation at an of 2 but was found at 28',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{contact-details firstName lastName=lastName}}'
    }, {
      'column': 45,
      'line': 1,
      'message': 'Incorrect indentation of close curly braces \'}}\' for the component \'{{contact-details}}\' beginning at L1:C45. Expected to be indentation at L2:C0 with an of 0 but was found at 45',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{contact-details firstName lastName=lastName}}'
    }]
  }, {
      //Block form with block-params
    template: '{{#contact-details firstName=firstName lastName=lastName}}' + '\n' +
              '  {{fullName}}' + '\n' +
              '{{/contact-details}}',
    results: [{
      'column': 19,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'firstName\' beginning at L1:C19. Expected \'firstName\' to be indentation at an of 2 but was found at 19',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName}}\n  {{fullName}}\n{{/contact-details}}'
    }, {
      'column': 39,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'lastName\' beginning at L1:C39. Expected \'lastName\' to be indentation at an of 2 but was found at 39',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName}}\n  {{fullName}}\n{{/contact-details}}'
    }]

  }, {
      //Block form with block-params
    template: '{{#contact-details firstName=firstName lastName=lastName as |fullName|}}' + '\n' +
              '  {{fullName}}' + '\n' +
              '{{/contact-details}}',
    results: [{
      'column': 19,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'firstName\' beginning at L1:C19. Expected \'firstName\' to be indentation at an of 2 but was found at 19',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName as |fullName|}}\n  {{fullName}}\n{{/contact-details}}'
    }, {
      'column': 39,
      'line': 1,
      'message': 'Incorrect indentation of attribute \'lastName\' beginning at L1:C39. Expected \'lastName\' to be indentation at an of 2 but was found at 39',
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName as |fullName|}}\n  {{fullName}}\n{{/contact-details}}'
    }, {
      'column': 56,
      'line': 1,
      'message': `Incorrect indentation of block params 'as |fullName|}}' beginning at L1:C56. Expecting the block params to be at L2:C0 with an indentation of 0 but was found at 56.`,
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details firstName=firstName lastName=lastName as |fullName|}}\n  {{fullName}}\n{{/contact-details}}'
    }]

  }, {
      //Block form with no params.
    template: '{{#contact-details as |contact|}}' + '\n' +
              '  {{contact.fullName}}' + '\n' +
              '{{/contact-details}}',
    results: [{
      'column': 18,
      'line': 1,
      'message': `Incorrect indentation of block params 'as |contact|}}' beginning at L1:C18. Expecting the block params to be at L2:C0 with an indentation of 0 but was found at 18.`,
      'moduleId': 'layout.hbs',
      'rule': 'attribute-indentation',
      'source': '{{#contact-details as |contact|}}\n  {{contact.fullName}}\n{{/contact-details}}'
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

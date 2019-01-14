'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-unnecessary-concat',

  config: true,

  good: ['<div class={{clazz}}></div>', '<div class="first {{second}}"></div>', '"{{foo}}"'],

  bad: [
    {
      template: '<div class="{{clazz}}"></div>',

      result: {
        message: 'Unnecessary string concatenation. Use {{clazz}} instead of "{{clazz}}".',
        moduleId: 'layout.hbs',
        source: '"{{clazz}}"',
        line: 1,
        column: 11,
      },
    },
    {
      template: '<img src="{{url}}" alt="{{t "alternate-text"}}">',

      results: [
        {
          message: 'Unnecessary string concatenation. Use {{url}} instead of "{{url}}".',
          moduleId: 'layout.hbs',
          source: '"{{url}}"',
          line: 1,
          column: 9,
        },
        {
          message:
            'Unnecessary string concatenation. Use {{t "alternate-text"}} instead of "{{t "alternate-text"}}".',
          moduleId: 'layout.hbs',
          source: '"{{t "alternate-text"}}"',
          line: 1,
          column: 23,
        },
      ],
    },
  ],
});

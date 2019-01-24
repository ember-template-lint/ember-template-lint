'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-distracting-elements',

  config: true,

  good: ['<div></div>', '<span></span>'],

  bad: [
    {
      template: '<marquee></marquee>',

      result: {
        message:
          'Do not use <marquee> elements as they can create visual accessibility issues and are deprecated.',
        moduleId: 'layout.hbs',
        source: '<marquee></marquee>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<blink></blink>',

      result: {
        message:
          'Do not use <blink> elements as they can create visual accessibility issues and are deprecated.',
        moduleId: 'layout.hbs',
        source: '<blink></blink>',
        line: 1,
        column: 0,
      },
    },
  ],
});

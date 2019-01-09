'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'link-href-attributes',

  config: true,

  good: [
    '<a href=""></a>' /* empty string is really valid! */,
    '<a href="#"></a>',
    '<a href="javascript:;"></a>',
    '<a href="http://localhost"></a>',
    '<a href={{link}}></a>',
  ],

  bad: [
    {
      template: '<a></a>',
      result: {
        message: 'a tags must have an href attribute',
        moduleId: 'layout.hbs',
        source: '<a></a>',
        line: 1,
        column: 0,
      },
    },
  ],
});

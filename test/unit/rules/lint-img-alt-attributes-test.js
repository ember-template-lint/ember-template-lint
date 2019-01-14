'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'img-alt-attributes',

  config: true,

  good: [
    '<img alt="hullo">',
    '<img alt={{foo}}>',
    '<img alt="blah {{derp}}">',
    '<img aria-hidden="true">',
    '<img alt="">',
    '<img alt>',
  ],

  bad: [
    {
      template: '<img>',

      result: {
        message: 'img tags must have an alt attribute',
        moduleId: 'layout.hbs',
        source: '<img>',
        line: 1,
        column: 0,
      },
    },
  ],
});

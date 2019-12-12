'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-meta',

  config: true,

  good: [
    '<meta http-equiv="refresh" content="0; url=http://www.example.com">',
    '<meta http-equiv="refresh" content="72001">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable = yes">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable= yes">',
  ],

  bad: [
    {
      template: '<meta http-equiv="refresh" content="1; url=http://www.example.com">',

      result: {
        moduleId: 'layout.hbs',
        message: 'a meta redirect should not have a delay value greater than zero',
        line: 1,
        column: 0,
        source: '<meta http-equiv="refresh" content="1; url=http://www.example.com">',
      },
    },
    {
      template: '<meta http-equiv="refresh" content="71999">',

      result: {
        moduleId: 'layout.hbs',
        message: 'a meta refresh should have a delay greater than 72000 seconds',
        line: 1,
        column: 0,
        source: '<meta http-equiv="refresh" content="71999">',
      },
    },
    {
      template: '<meta name="viewport" content="user-scalable=no">',

      result: {
        moduleId: 'layout.hbs',
        message: 'a meta viewport should not restrict user-scalable',
        line: 1,
        column: 0,
        source: '<meta name="viewport" content="user-scalable=no">',
      },
    },
    {
      template: '<meta name="viewport" content="user-scalable = no">',

      result: {
        moduleId: 'layout.hbs',
        message: 'a meta viewport should not restrict user-scalable',
        line: 1,
        column: 0,
        source: '<meta name="viewport" content="user-scalable = no">',
      },
    },
    {
      template: '<meta name="viewport" content="user-scalable= no">',

      result: {
        moduleId: 'layout.hbs',
        message: 'a meta viewport should not restrict user-scalable',
        line: 1,
        column: 0,
        source: '<meta name="viewport" content="user-scalable= no">',
      },
    },
    {
      template:
        '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">',

      result: {
        moduleId: 'layout.hbs',
        message: 'a meta viewport should not set a maximum scale on content',
        line: 1,
        column: 0,
        source:
          '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">',
      },
    },
  ],
});

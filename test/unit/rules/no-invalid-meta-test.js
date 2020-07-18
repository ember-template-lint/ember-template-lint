'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-invalid-meta',

  config: true,

  good: [
    '<meta>',
    '<meta charset="UTF-8">',
    '<meta http-equiv="refresh" content="0; url=http://www.example.com">',
    '<meta http-equiv="refresh" content="72001">',
    '<meta http-equiv={{httpEquiv}} content={{content}}>',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable = yes">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable= yes">',
    '<meta name={{name}} content={{content}}>',
    '<meta property="og:type" content="website">',

    // doesn't error on unrelated elements
    '<div></div>',
  ],

  bad: [
    {
      template: '<meta http-equiv="refresh" content="1; url=http://www.example.com">',

      result: {
        message: 'a meta redirect should not have a delay value greater than zero',
        line: 1,
        column: 0,
        source: '<meta http-equiv="refresh" content="1; url=http://www.example.com">',
      },
    },
    {
      template: '<meta http-equiv="refresh" content="71999">',

      result: {
        message: 'a meta refresh should have a delay greater than 72000 seconds',
        line: 1,
        column: 0,
        source: '<meta http-equiv="refresh" content="71999">',
      },
    },
    {
      template: '<meta name="viewport" content="user-scalable=no">',

      result: {
        message: 'a meta viewport should not restrict user-scalable',
        line: 1,
        column: 0,
        source: '<meta name="viewport" content="user-scalable=no">',
      },
    },
    {
      template: '<meta name="viewport" content="user-scalable = no">',

      result: {
        message: 'a meta viewport should not restrict user-scalable',
        line: 1,
        column: 0,
        source: '<meta name="viewport" content="user-scalable = no">',
      },
    },
    {
      template: '<meta name="viewport" content="user-scalable= no">',

      result: {
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
        message: 'a meta viewport should not set a maximum scale on content',
        line: 1,
        column: 0,
        source:
          '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">',
      },
    },

    {
      template: '<meta name="viewport">',

      result: {
        message:
          'a meta content attribute must be defined if the name, property or the http-equiv attribute is defined',
        line: 1,
        column: 0,
        source: '<meta name="viewport">',
      },
    },
    {
      template: '<meta property="og:type">',

      result: {
        message:
          'a meta content attribute must be defined if the name, property or the http-equiv attribute is defined',
        line: 1,
        column: 0,
        source: '<meta property="og:type">',
      },
    },
    {
      template: '<meta http-equiv="refresh">',

      result: {
        message:
          'a meta content attribute must be defined if the name, property or the http-equiv attribute is defined',
        line: 1,
        column: 0,
        source: '<meta http-equiv="refresh">',
      },
    },
    {
      template: '<meta content="72001">',

      result: {
        message:
          'a meta content attribute cannot be defined if the name, property nor the http-equiv attributes are defined',
        line: 1,
        column: 0,
        source: '<meta content="72001">',
      },
    },
  ],
});

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-childless-elements',

  config: true,

  good: [
    '<h1>something</h1>',
    '<h2>something</h2>',
    '<h3>something</h3>',
    '<h4>something</h4>',
    '<h5>something</h5>',
    '<h6>something</h6>',
    '<p>something</p>',
    '<span>something</span>',
    '<a>something</a>',
    '<ul>something</ul>',
    '<ol>something</ol>',
    '<li>something</li>',
    '<div>something</div>',
  ],

  bad: [
    {
      template: '<h1></h1>',
      message: 'Empty non-void elements are not allowed',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<h1></h1>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h2></h2>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<h2></h2>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h3></h3>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<h3></h3>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h4></h4>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<h4></h4>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h5></h5>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<h5></h5>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h6></h6>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<h6></h6>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<p></p>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<p></p>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<span></span>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<span></span>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<a></a>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<a></a>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<ul></ul>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<ul></ul>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<ol></ol>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<ol></ol>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<li></li>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<li></li>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div></div>',

      result: {
        message: 'Empty non-void elements are not allowed',
        moduleId: 'layout.hbs',
        source: '<div></div>',
        line: 1,
        column: 0,
      },
    },
  ],
});

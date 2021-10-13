'use strict';

const { ERROR_MESSAGE } = require('../../../lib/rules/no-empty-headings');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-empty-headings',

  config: true,

  good: [
    '<h1>Accessible Heading</h1>',
    '<h1>Accessible&nbsp;Heading</h1>',
    '<h1 aria-hidden="true">Valid Heading</h1>',
    '<h1 aria-hidden="true"><span>Valid Heading</span></h1>',
    '<h1 aria-hidden="false">Accessible Heading</h1>',
    '<h1 hidden>Valid Heading</h1>',
    '<h1 hidden><span>Valid Heading</span></h1>',
    '<h1><span aria-hidden="true">Hidden text</span><span>Visible text</span></h1>',
    '<h1><span aria-hidden="true">Hidden text</span>Visible text</h1>',
    '<div role="heading" aria-level="1">Accessible Text</div>',
    '<div role="heading" aria-level="1"><span>Accessible Text</span></div>',
    '<div role="heading" aria-level="1"><span aria-hidden="true">Hidden text</span><span>Visible text</span></div>',
    '<div role="heading" aria-level="1"><span aria-hidden="true">Hidden text</span>Visible text</div>',
    '<div></div>',
    '<p></p>',
    '<span></span>',
    '<header></header>',
    '<h2>{{@title}}</h2>',
    '<h2>{{#component}}some text{{/component}}</h2>',
    '<h2><span>{{@title}}</span></h2>',
    '<h2><div><span>{{@title}}</span></div></h2>',
    '<h2><span>Some text{{@title}}</span></h2>',
  ],

  bad: [
    {
      template: '<h1></h1>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h1></h1>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h1> \n &nbsp;</h1>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h1> \n &nbsp;</h1>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h1> &nbsp; <div aria-hidden="true">Some hidden text</div></h1>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h1> &nbsp; <div aria-hidden="true">Some hidden text</div></h1>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h1><span aria-hidden="true">Inaccessible text</span></h1>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h1><span aria-hidden="true">Inaccessible text</span></h1>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h1><span hidden>Inaccessible text</span></h1>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h1><span hidden>Inaccessible text</span></h1>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h1><span hidden>{{@title}}</span></h1>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h1><span hidden>{{@title}}</span></h1>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<h1><span hidden>{{#component}}Inaccessible text{{/component}}</span></h1>',
      result: {
        message: ERROR_MESSAGE,
        source: '<h1><span hidden>{{#component}}Inaccessible text{{/component}}</span></h1>',
        line: 1,
        column: 0,
      },
    },
    {
      template:
        '<h1><span aria-hidden="true">Hidden text</span><span aria-hidden="true">Hidden text</span></h1>',
      result: {
        message: ERROR_MESSAGE,
        source:
          '<h1><span aria-hidden="true">Hidden text</span><span aria-hidden="true">Hidden text</span></h1>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div role="heading" aria-level="1"></div>',
      result: {
        message: ERROR_MESSAGE,
        source: '<div role="heading" aria-level="1"></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template:
        '<div role="heading" aria-level="1"><span aria-hidden="true">Inaccessible text</span></div>',
      result: {
        message: ERROR_MESSAGE,
        source:
          '<div role="heading" aria-level="1"><span aria-hidden="true">Inaccessible text</span></div>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<div role="heading" aria-level="1"><span hidden>Inaccessible text</span></div>',
      result: {
        message: ERROR_MESSAGE,
        source: '<div role="heading" aria-level="1"><span hidden>Inaccessible text</span></div>',
        line: 1,
        column: 0,
      },
    },
  ],
});

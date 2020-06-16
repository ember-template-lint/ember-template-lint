'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/no-duplicate-id').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-duplicate-id',

  config: true,

  good: [
    // Unique sibling TextNode IDs
    '<div id="id-00"></div><div id="id-01"></div>',

    // Ignore MustacheStatements, even duplicates
    '<div id={{this.divId}}></div>',
    '<div id={{this.divId}}></div><div id={{this.divId}}></div>',

    // Ignore ConcatStatements, even duplicates
    '<div id="concat-{{this.divId}}"></div>',
    '<div id="concat-{{this.divId}}"></div><div id="concat-{{this.divId}}"></div>',

    // Mustache and Concat do not conflict/flag with TextNode
    '<div id={{id-00}}></div><div id="id-00"></div>',
    '<div id="id-00"></div><div id={{id-00}}></div>',
    '<div id="concat-{{id-00}}"></div><div id="concat-id-00"></div>',
    '<div id="concat-id-00"></div><div id="concat-{{id-00}}"></div>',

    // BlockStatement
    '<div id="id-00"></div>{{#foo elementId="id-01"}}{{/foo}}',
    '{{#foo elementId="id-01"}}{{/foo}}<div id="id-00"></div>',
  ],

  bad: [
    {
      template: '<div id="id-00"></div><div id="id-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id="id-00"',
      },
    },
    {
      template: '<div><div id="id-01"></div></div><div><div id="id-01"></div></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 43,
        source: 'id="id-01"',
      },
    },

    {
      template: '<div id="id-00"></div><div id={{"id-00"}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id={{"id-00"}}',
      },
    },

    {
      template: '<div id={{"id-00"}}></div><div id="id-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 31,
        source: 'id="id-00"',
      },
    },

    {
      template: '<div id="id-00"></div><div id="id-{{"00"}}"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id="id-{{"00"}}"',
      },
    },

    {
      template: '<div id="id-00"></div><div id="{{"id"}}-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 27,
        source: 'id="{{"id"}}-00"',
      },
    },

    // BlockStatement
    {
      template: '<div id="id-00"></div>{{#foo elementId="id-00"}}{{/foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 22,
        source: '{{#foo elementId="id-00"}}{{/foo}}',
      },
    },

    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-00"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 39,
        source: 'id="id-00"',
      },
    },

    {
      template: '<div id={{"id-00"}}></div>{{#foo elementId="id-00"}}{{/foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 26,
        source: '{{#foo elementId="id-00"}}{{/foo}}',
      },
    },

    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id={{"id-00"}}></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 39,
        source: 'id={{"id-00"}}',
      },
    },

    {
      template: '<div id="id-{{"00"}}"></div>{{#foo elementId="id-00"}}{{/foo}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 28,
        source: '{{#foo elementId="id-00"}}{{/foo}}',
      },
    },

    {
      template: '{{#foo elementId="id-00"}}{{/foo}}<div id="id-{{"00"}}"></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 39,
        source: 'id="id-{{"00"}}"',
      },
    },

    {
      template: '{{#foo elementId="id-00"}}{{/foo}}{{#bar elementId="id-00"}}{{/bar}}',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 34,
        source: '{{#bar elementId="id-00"}}{{/bar}}',
      },
    },
  ],
});

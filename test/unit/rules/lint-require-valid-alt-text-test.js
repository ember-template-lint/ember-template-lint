'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'require-valid-alt-text',

  config: true,

  good: [
    '<img alt="hullo">',
    '<img alt={{foo}}>',
    '<img alt="blah {{derp}}">',
    '<img aria-hidden="true">',
    '<img alt="" role="none" src="zoey.jpg">',
    '<img alt="" role="presentation" src="zoey.jpg">',
    '<img alt="a stylized graphic of a female hamster" src="zoey.jpg">',

    '<input type="image" alt="some-alt">',
    '<input type="image" aria-labelledby="some-alt">',
    '<input type="image" aria-label="some-alt">',

    '<object title="some-alt"></object>',
    '<object aria-labelledby="some-alt"></object>',
    '<object aria-label="some-alt"></object>',
    '<object>some text</object>',

    '<area alt="some-alt">',
    '<area aria-labelledby="some-alt">',
    '<area aria-label="some-alt">',
  ],

  bad: [
    {
      template: '<img>',

      result: {
        message:
          'img tags must have an alt attribute, either with meaningful text, or an empty string for decorative images.',
        moduleId: 'layout.hbs',
        source: '<img>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img src="zoey.jpg">',

      result: {
        message:
          'img tags must have an alt attribute, either with meaningful text, or an empty string for decorative images.',
        moduleId: 'layout.hbs',
        source: '<img src="zoey.jpg">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="" src="zoey.jpg">',

      result: {
        message:
          'img tags must have an alt attribute, either with meaningful text, or an empty string for decorative images.',
        moduleId: 'layout.hbs',
        source: '<img alt="" src="zoey.jpg">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt src="zoey.jpg">',

      result: {
        message:
          'img tags must have an alt attribute, either with meaningful text, or an empty string for decorative images.',
        moduleId: 'layout.hbs',
        source: '<img alt src="zoey.jpg">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<input type="image">',

      result: {
        message:
          '<input> elements with type="image" must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.',
        moduleId: 'layout.hbs',
        source: '<input type="image">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<object></object>',
      result: {
        message:
          'Embedded <object> elements must have alternative text by providing inner text, aria-label or aria-labelledby attributes.',
        moduleId: 'layout.hbs',
        source: '<object></object>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<object />',
      result: {
        message:
          'Embedded <object> elements must have alternative text by providing inner text, aria-label or aria-labelledby attributes.',
        moduleId: 'layout.hbs',
        source: '<object />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<area>',
      result: {
        message:
          'Each area of an image map must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.',
        moduleId: 'layout.hbs',
        source: '<area>',
        line: 1,
        column: 0,
      },
    },
  ],
});

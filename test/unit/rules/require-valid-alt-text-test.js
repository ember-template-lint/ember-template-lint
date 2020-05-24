'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/require-valid-alt-text').ERROR_MESSAGE;

generateRuleTests({
  name: 'require-valid-alt-text',

  config: true,

  good: [
    '<img alt="hullo">',
    '<img alt={{foo}}>',
    '<img alt="blah {{derp}}">',
    '<img aria-hidden="true">',
    '<img hidden>',
    '<img alt="" role="none" src="zoey.jpg">',
    '<img alt="" role="presentation" src="zoey.jpg">',
    '<img alt="a stylized graphic of a female hamster" src="zoey.jpg">',

    '<img alt="some-alt-name">',
    '<img alt="name {{picture}}">',
    '<img aria-hidden="true">',
    '<img alt="{{picture}}">',
    '<img alt="" role="none">',
    '<img alt="" role="presentation">',

    '<img ...attributes>',

    '<input type="image" alt="some-alt">',
    '<input type="image" aria-labelledby="some-alt">',
    '<input type="image" aria-label="some-alt">',
    '<input type="image" hidden>',
    '<input type="image" aria-hidden="true">',

    '<object title="some-alt"></object>',
    '<object role="presentation"></object>',
    '<object role="none"></object>',
    '<object hidden></object>',
    '<object aria-hidden="true"></object>',
    '<object aria-labelledby="some-alt"></object>',
    '<object aria-label="some-alt"></object>',
    '<object>some text</object>',

    '<area alt="some-alt">',
    '<area hidden>',
    '<area aria-hidden="true">',
    '<area aria-labelledby="some-alt">',
    '<area aria-label="some-alt">',
    '<img role={{unless this.altText "presentation"}} alt={{this.altText}}>',
  ],

  bad: [
    {
      template: '<img>',

      result: {
        message: 'All `<img>` tags must have an alt attribute',
        source: '<img>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img src="zoey.jpg">',

      result: {
        message: 'All `<img>` tags must have an alt attribute',
        source: '<img src="zoey.jpg">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="" src="zoey.jpg">',

      result: {
        message:
          'If the `alt` attribute is present and the value is an empty string, `role="presentation"` or `role="none"` must be present',
        source: '<img alt="" src="zoey.jpg">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt src="zoey.jpg">',

      result: {
        message:
          'If the `alt` attribute is present and the value is an empty string, `role="presentation"` or `role="none"` must be present',
        source: '<img alt src="zoey.jpg">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="path/to/zoey.jpg" src="path/to/zoey.jpg">',
      result: {
        message: 'The alt text must not be the same as the image source',
        source: '<img alt="path/to/zoey.jpg" src="path/to/zoey.jpg">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<input type="image">',

      result: {
        message:
          'All <input> elements with type="image" must have a text alternative through the `alt`, `aria-label`, or `aria-labelledby` attribute.',
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
        source: '<area>',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="picture">',

      result: {
        message: ERROR_MESSAGE,
        source: '<img alt="picture">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="photo">',

      result: {
        message: ERROR_MESSAGE,
        source: '<img alt="photo">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="image">',

      result: {
        message: ERROR_MESSAGE,
        source: '<img alt="image">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="  IMAGE ">',

      result: {
        message: ERROR_MESSAGE,
        source: '<img alt="  IMAGE ">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="  IMAGE {{picture}} {{word}} ">',

      result: {
        message: ERROR_MESSAGE,
        source: '<img alt="  IMAGE {{picture}} {{word}} ">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="52" src="b52.jpg">',

      result: {
        message: 'A number is not valid alt text',
        source: '<img alt="52" src="b52.jpg">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="not-null-alt" src="zoey.jpg" role="none">',
      result: {
        message:
          'The `alt` attribute should be empty if `<img>` has `role` of `none` or `presentation`',
        source: '<img alt="not-null-alt" src="zoey.jpg" role="none">',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<img alt="not-null-alt" src="zoey.jpg" role="presentation">',
      result: {
        message:
          'The `alt` attribute should be empty if `<img>` has `role` of `none` or `presentation`',
        source: '<img alt="not-null-alt" src="zoey.jpg" role="presentation">',
        line: 1,
        column: 0,
      },
    },
  ],
});

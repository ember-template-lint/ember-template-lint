'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'quotes',

  good: [
    {
      config: true,
      template: '<img alt=\'tomster\' src="tomster.png">'
    }, {
      config: 'double',
      template: '<img alt="tomster" src="tomster.png">'
    }, {
      config: 'single',
      template: '<img alt=\'tomster\' src=\'tomster.png\'>'
    }, {
      config: 'double',
      template: '<img alt src="tomster.png">'
    }, {
      config: 'double',
      template: '<img alt src={{url-for-tomster}}>'
    }, {
      config: 'double',
      template: '<img alt src={{url-for "tomster"}}>'
    }, {
      config: 'double',
      template: '<img alt src={{url-for img="tomster"}}>'
    }, {
      config: 'double',
      template: '<img alt src={{url-for (inner-helper "tomster")}}>'
    }, {
      config: 'double',
      template: '<img alt src={{url-for hash-param=(inner-helper "tomster")}}>'
    }, {
      config: 'double',
      template: '<img alt src="{{url-for "tomster"}}">'
    }, {
      config: 'double',
      template: '{{url-for "tomster"}}'
    }
  ],

  bad: [
    {
      config: true,
      template: '<img alt=tomster>',
      result: {
        message: 'Quotes: you should use qoutes for HTML attributes',
        source: 'alt=tomster',
        line: 1,
        column: 5
      }
    }, {
      config: 'double',
      template: '<img alt=\'tomster\'>',
      result: {
        message: 'Quotes: you got single qoutes for an attribute instead of double qoutes',
        source: 'alt=\'tomster\'',
        line: 1,
        column: 5
      }
    }, {
      config: 'single',
      template: '<img alt="tomster">',
      result: {
        message: 'Quotes: you got double qoutes for an attribute instead of single qoutes',
        source: 'alt="tomster"',
        line: 1,
        column: 5
      }
    }
  ]
});

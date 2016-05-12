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
        message: 'Quotes: you should use quotes for attributes',
        source: 'alt=tomster',
        line: 1,
        column: 5
      }
    }, {
      config: 'double',
      template: '<img alt=\'tomster\'>',
      result: {
        message: 'Quotes: you got single quotes when you set quotes style to be double quotes',
        source: 'alt=\'tomster\'',
        line: 1,
        column: 5
      }
    }, {
      config: 'single',
      template: '<img alt="tomster">',
      result: {
        message: 'Quotes: you got double quotes when you set quotes style to be single quotes',
        source: 'alt="tomster"',
        line: 1,
        column: 5
      }
    }, {
      config: 'single',
      template: '<img alt={{url "tomster"}}>',
      result: {
        message: 'Quotes: you got double quotes when you set quotes style to be single quotes',
        source: '"tomster"',
        line: 1,
        column: 15
      }
    }, {
      config: 'single',
      template: '<img alt={{url local="tomster"}}>',
      result: {
        message: 'Quotes: you got double quotes when you set quotes style to be single quotes',
        source: '"tomster"',
        line: 1,
        column: 21
      }
    }
  ]
});

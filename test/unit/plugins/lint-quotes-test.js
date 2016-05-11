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
    // TODO:
    // }, {
    //   config: 'double',
    //   template: '<img alt src=tomster.png>'
    }
  ],

  bad: [
    {
      config: true,
      template: '<img alt=tomster>',
      message: 'Quotes: you should use qoutes for HTML attributes (\'layout.hbs\'@ L1:C6)'
    }, {
      config: 'double',
      template: '<img alt=\'tomster\'>',
      message: 'Quotes: you got single qoutes for an attribute instead of double qoutes (\'layout.hbs\'@ L1:C6)'
    }, {
      config: 'single',
      template: '<img alt="tomster">',
      message: 'Quotes: you got double qoutes for an attribute instead of single qoutes (\'layout.hbs\'@ L1:C6)'
    }
  ]
});

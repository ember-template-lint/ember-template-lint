'use strict';

var generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'non-phrasing-inside-phrasing',

  config: true,

  good: [
    '<div><span>phrasing in non phrasing</span></div>',
    '<span><span>phrasing in phrasing</span></span>',
    '<span><span>phrasing in phrasing</span></span>',
    // TODO this fails because it has source in video :/
    // TODO same problem with select and option, probably more uncategorized? tags
    // '<video width="320" height="240" autoplay><source src="movie.mp4" type="video/mp4"><source src="movie.ogg" type="video/ogg">Your browser does not support the video tag.</video>'
  ],

  bad: [
    {
      template: '<div><div></div><span><span></span><div>inside<div>further-inside</div></div></span></div>',

      results: [
        {
          rule: 'non-phrasing-inside-phrasing',
          message: 'non phrasing element was found in phrasing element(s): span',
          moduleId: 'layout.hbs',
          source: '<div>inside<div>further-inside</div></div>',
          line: 1,
          column: 35
        },
        {
          rule: 'non-phrasing-inside-phrasing',
          message: 'non phrasing element was found in phrasing element(s): span',
          moduleId: 'layout.hbs',
          source: '<div>further-inside</div>',
          line: 1,
          column: 46
        },
      ]
    },
    {
      template: '<span><span><div>div in a span in a span</div></span></span>',

      results: [
        {
          rule: 'non-phrasing-inside-phrasing',
          message: 'non phrasing element was found in phrasing element(s): span,span',
          moduleId: 'layout.hbs',
          source: '<div>div in a span in a span</div>',
          line: 1,
          column: 12
        },
      ]
    }
  ]
});

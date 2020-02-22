'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

function mapBadStyleExampleToTestRule(inlineStyle) {
  return {
    template: `<div ${inlineStyle}></div>`,

    result: {
      message: 'elements cannot have inline styles',
      moduleId: 'layout.hbs',
      source: inlineStyle,
      line: 1,
      column: 5,
    },
  };
}

function mapBadStyleExampleToTestRuleWithConfig(inlineStyle, config) {
  const testCase = mapBadStyleExampleToTestRule(inlineStyle);
  testCase.config = config;
  return testCase;
}

generateRuleTests({
  name: 'no-inline-styles',

  config: true,

  good: [
    '<div></div>',
    '<span></span>',
    '<ul class="dummy"></ul>',
    '<div style={{foo}}></div>',
    '<div style={{html-safe (concat "background-image: url(" url ")")}}></div>',
  ],

  bad: [
    ...[
      'style="width: 100px"',
      'style="{{foo}} {{bar}}"',
      'style',
      'style=""',
      'style="color:blue;margin-left:30px;"',
    ].map(mapBadStyleExampleToTestRule),
    mapBadStyleExampleToTestRuleWithConfig('style={{foo}}', { allowDynamicStyles: false }),
  ],
});

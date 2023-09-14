import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-link-to-positional-params',

  config: true,

  good: ['<div></div>', '<div class="foo"></div>', '<div class></div>'],
  bad: [
    {
      template: '<div className></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot();
      },
    },
    {
      template: '<div className="foo"></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot();
      },
    },
  ],
});

import { MESSAGES } from '../../../lib/rules/no-at-ember-render-modifiers.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-at-ember-render-modifiers',

  config: true,

  good: ['<div {{this.someModifier}}></div>', '<div {{someModifier}}></div>'],

  bad: [
    {
      template: '<div {{did-insert}}></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": ${MESSAGES['did-insert']},
              "rule": "no-action-modifiers",
              "severity": 2,
              "source": "<button {{action \\"foo\\"}}></button>",
            },
          ]
        `);
      },
    },
  ],
});

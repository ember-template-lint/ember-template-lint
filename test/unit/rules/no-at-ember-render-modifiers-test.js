import { MESSAGES } from '../../../lib/rules/no-at-ember-render-modifiers.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-at-ember-render-modifiers',

  config: true,

  good: [
    '<div {{this.someModifier}}></div>',
    '<div {{someModifier}}></div>',
    '<div {{did-foo}}></div>',
    // helper -- a different rule should prevent this
    // https://github.com/buschtoens/ember-render-helpers (depending on usage)
    '{{did-insert}}',
    '{{did-update}}',
    '{{will-destroy}}',
  ],

  bad: [
    {
      template: '<div {{did-insert}}></div>',
      verifyResults(results) {
        expect({ results }).toMatchInlineSnapshot(
          {
            results: [
              {
                column: 5,
                endColumn: 19,
                endLine: 1,
                filePath: 'layout.hbs',
                line: 1,
                message: MESSAGES['did-insert'],
                rule: 'no-at-ember-render-modifiers',
                severity: 2,
                source: '<div {{did-insert}}></div>',
              },
            ],
          },
          `
          {
            "results": [
              {
                "column": 5,
                "endColumn": 19,
                "endLine": 1,
                "filePath": "layout.hbs",
                "line": 1,
                "message": "Do not use the \`did-insert\` modifier. This modifier was intended to ease migration to Octane and not for long-term side-effects. Instead, refactor to use a custom modifier. See https://github.com/ember-modifier/ember-modifier",
                "rule": "no-at-ember-render-modifiers",
                "severity": 2,
                "source": "<div {{did-insert}}></div>",
              },
            ],
          }
        `
        );
      },
    },
    {
      template: '<div {{did-update}}></div>',
      verifyResults(results) {
        expect({ results }).toMatchInlineSnapshot(
          {
            results: [
              {
                column: 5,
                endColumn: 19,
                endLine: 1,
                filePath: 'layout.hbs',
                line: 1,
                message: MESSAGES['did-update'],
                rule: 'no-at-ember-render-modifiers',
                severity: 2,
                source: '<div {{did-update}}></div>',
              },
            ],
          },
          `
          {
            "results": [
              {
                "column": 5,
                "endColumn": 19,
                "endLine": 1,
                "filePath": "layout.hbs",
                "line": 1,
                "message": "Do not use the \`did-update\` modifier. This modifier was intended to ease migration to Octane and not for long-term side-effects. Instead, refactor to use a custom modifier. See https://github.com/ember-modifier/ember-modifier",
                "rule": "no-at-ember-render-modifiers",
                "severity": 2,
                "source": "<div {{did-update}}></div>",
              },
            ],
          }
        `
        );
      },
    },
    {
      template: '<div {{will-destroy}}></div>',
      verifyResults(results) {
        expect({ results }).toMatchInlineSnapshot(
          {
            results: [
              {
                column: 5,
                endColumn: 21,
                endLine: 1,
                filePath: 'layout.hbs',
                line: 1,
                message: MESSAGES['will-destroy'],
                rule: 'no-at-ember-render-modifiers',
                severity: 2,
                source: '<div {{will-destroy}}></div>',
              },
            ],
          },
          `
          {
            "results": [
              {
                "column": 5,
                "endColumn": 21,
                "endLine": 1,
                "filePath": "layout.hbs",
                "line": 1,
                "message": "Do not use the \`will-destroy\` modifier. This modifier was intended to ease migration to Octane and not for long-term side-effects. Instead, refactor to use a custom modifier. See https://github.com/ember-modifier/ember-modifier",
                "rule": "no-at-ember-render-modifiers",
                "severity": 2,
                "source": "<div {{will-destroy}}></div>",
              },
            ],
          }
        `
        );
      },
    },
  ],
});

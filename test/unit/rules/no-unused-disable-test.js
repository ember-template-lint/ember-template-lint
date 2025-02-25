import { ERROR_SEVERITY } from '../../../lib/helpers/severity.js';
import { generateRuleTests } from '../../../test-helpers.js';

generateRuleTests({
  name: 'no-unused-disable',

  config: true,

  good: [
    // properly used disable directive
    {
      template: `
        {{! template-lint-disable no-bare-strings }}
        Hello world
      `,
      meta: {
        filePath: 'app/templates/application.hbs',
      },
      rules: {
        'no-bare-strings': true,
      },
    },
    // disable followed by enable
    {
      template: `
        {{! template-lint-disable no-bare-strings }}
        Hello world
        {{! template-lint-enable no-bare-strings }}
        {{t "greeting"}}
      `,
      meta: {
        filePath: 'app/templates/application.hbs',
      },
      rules: {
        'no-bare-strings': true,
      },
    },
  ],

  bad: [
    {
      template: `
        {{! template-lint-disable no-bare-strings }}
        {{t "greeting"}}
      `,
      meta: {
        filePath: 'app/templates/application.hbs',
      },
      rules: {
        'no-bare-strings': true,
      },
      result: {
        message: 'Unused disable directive',
        line: 2,
        column: 9,
        source: '{{! template-lint-disable no-bare-strings }}',
        severity: ERROR_SEVERITY,
      },
    },
    {
      template: `
        {{! template-lint-disable no-bare-strings, no-html-comments }}
        {{t "greeting"}}
        <!-- A comment -->
      `,
      meta: {
        filePath: 'app/templates/application.hbs',
      },
      rules: {
        'no-bare-strings': true,
        'no-html-comments': true,
      },
      result: {
        message: 'Unused disable directive',
        line: 2,
        column: 9,
        source: '{{! template-lint-disable no-bare-strings, no-html-comments }}',
        severity: ERROR_SEVERITY,
      },
    },
    {
      template: `
        {{! template-lint-disable-tree no-bare-strings }}
        {{t "greeting"}}
      `,
      meta: {
        filePath: 'app/templates/application.hbs',
      },
      rules: {
        'no-bare-strings': true,
      },
      result: {
        message: 'Unused disable directive',
        line: 2,
        column: 9,
        source: '{{! template-lint-disable-tree no-bare-strings }}',
        severity: ERROR_SEVERITY,
      },
    },
  ],
});

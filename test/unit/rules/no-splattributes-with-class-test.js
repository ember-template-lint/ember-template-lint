import { ERROR_MESSAGE } from '../../../lib/rules/no-splattributes-with-class.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-splattributes-with-class',

  config: true,

  good: [
    '<div ...attributes>content</div>',
    '<div class="foo">content</div>',
    '<div class="foo bar">content</div>',
    '<div class={{foo}}>content</div>',
    '<div class="foo {{bar}}">content</div>',
  ],

  bad: [
    {
      template: '<div ...attributes class="foo">content</div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 19,
        source: 'class="foo"',
      },
    },
    {
      template: '<div class="foo" ...attributes>content</div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: 'class="foo"',
      },
    },
    {
      template: '<div ...attributes class={{foo}}>content</div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 19,
        source: 'class={{foo}}',
      },
    },
    {
      template: '<div class="foo" ...attributes class="bar">content</div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: 'class="foo"',
      },
    },
  ],
});

import {
  ERROR_MESSAGE_OBSOLETE_ELEMENT,
  OBSOLETE_ELEMENTS,
} from '../../../lib/rules/no-obsolete-elements.js';
import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-obsolete-elements',

  config: true,

  good: [
    '<div></div>',
    `{{#let (component 'whatever-here') as |plaintext|}}
      <plaintext />
    {{/let}}`,
  ],

  bad: OBSOLETE_ELEMENTS.map((element) => {
    const VOID_ELEMENTS = ['keygen'];
    const html = VOID_ELEMENTS.includes(element) ? `<${element}>` : `<${element}></${element}>`;
    return {
      template: html,
      result: {
        message: ERROR_MESSAGE_OBSOLETE_ELEMENT(element),
        source: html,
        line: 1,
        column: 0,
        endLine: 1,
        endColumn: html.length,
      },
    };
  }),
});

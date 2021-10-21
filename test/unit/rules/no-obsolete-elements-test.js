'use strict';

const { OBSOLETE_ELEMENTS } = require('../../../lib/rules/no-obsolete-elements');
const generateRuleTests = require('../../helpers/rule-test-harness');

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
      verifyResults(results) {
        expect(results).toMatchSnapshot();
      },
    };
  }),
});

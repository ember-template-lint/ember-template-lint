'use strict';

const {
  ERROR_MESSAGE_OBSOLETE_ELEMENT,
  OBSOLETE_ELEMENTS,
} = require('../../../lib/rules/no-obsolete-elements');
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
    return {
      template: `<${element}></${element}>`,
      result: {
        message: ERROR_MESSAGE_OBSOLETE_ELEMENT(element),
        source: `<${element}></${element}>`,
        line: 1,
        column: 0,
      },
    };
  }),
});

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const rule = require('../../../lib/rules/no-obsolete-elements');

const ERROR_MESSAGE_OBSOLETE_ELEMENT = rule.ERROR_MESSAGE_OBSOLETE_ELEMENT;
const OBSOLETE_ELEMENTS = rule.OBSOLETE_ELEMENTS;

generateRuleTests({
  name: 'no-obsolete-elements',

  config: true,

  good: [
    '<div></div>',
    `{{#let (component 'whatever-here') as |plaintext|}}
      <plaintext />
    {{/let}}`,
  ],

  bad: OBSOLETE_ELEMENTS.map(element => {
    return {
      template: `<${element}></${element}>`,
      result: {
        message: ERROR_MESSAGE_OBSOLETE_ELEMENT(element),
        moduleId: 'layout.hbs',
        source: `<${element}></${element}>`,
        line: 1,
        column: 0,
      },
    };
  }),
});

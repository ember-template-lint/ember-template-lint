// no-whitespace-within-word-test.js

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');
const ERROR_MESSAGE = require('../../../lib/rules/lint-no-whitespace-within-word').ERROR_MESSAGE;

generateRuleTests({
  name: 'no-whitespace-within-word',
  config: true,

  good: [
    'Welcome',
    `It is possible to get some examples of in-word emph a sis past this rule.`,
    `However, I do not want a rule that flags annoying false positives for correctly-used single-character words.`,
    '<div>Welcome</div>',
  ],

  bad: [
    {
      template: 'W e l c o m e',

      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'W e l c o m e',
      },
    },
    {
      template: 'W&nbsp;e&nbsp;l&nbsp;c&nbsp;o&nbsp;m&nbsp;e',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'W&nbsp;e&nbsp;l&nbsp;c&nbsp;o&nbsp;m&nbsp;e',
      },
    },
    {
      template: 'Wel c o me',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'Wel c o me',
      },
    },
    {
      template: 'Wel&nbsp;c&emsp;o&nbsp;me',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 0,
        source: 'Wel&nbsp;c&emsp;o&nbsp;me',
      },
    },
    {
      template: '<div>W e l c o m e</div>',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: 'W e l c o m e',
      },
    },
    {
      template: '<div>Wel c o me</div>',
      result: {
        moduleId: 'layout.hbs',
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: 'Wel c o me',
      },
    },
  ],
});

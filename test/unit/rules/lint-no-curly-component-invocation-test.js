const generateRuleTests = require('../../helpers/rule-test-harness');
const { transformTagName } = require('../../../lib/helpers/curly-component-invocation');

function generateError(name) {
  let angleBracketName = transformTagName(name);
  return `You are using the component {{${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
}

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    allow: ['some-valid-helper', 'some/valid-nested-helper'],
  },

  good: [
    '<GoodCode />',
    '<GoodCode></GoodCode>',
    '{{if someProperty "yay"}}',
    '<Nested::GoodCode />',
    '<Nested::GoodCode @someProperty={{-50}} @someProperty={{"-50"}}/ />',
    '{{some-valid-helper param}}',
    '{{some/valid-nested-helper param}}',
    `{{#each items as |item|}}
      {{item}}
     {{/each}}`,
  ],

  bad: [
    {
      template: '{{bad-code}}',
      results: [getErrorResult(generateError('bad-code'), '{{bad-code}}')],
    },
    {
      template: '{{nested/bad-code}}',
      results: [getErrorResult(generateError('nested/bad-code'), '{{nested/bad-code}}')],
    },
  ],
});

function getErrorResult(message, source) {
  return {
    rule: 'no-curly-component-invocation',
    severity: 2,
    moduleId: 'layout.hbs',
    message,
    line: 1,
    column: 0,
    source,
  };
}

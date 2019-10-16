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
    disallow: ['heading'],
  },

  good: [
    '<GoodCode />',
    '<GoodCode></GoodCode>',
    '{{if someProperty "yay"}}',
    '<Nested::GoodCode />',
    '<Nested::GoodCode @someProperty={{-50}} @someProperty={{"-50"}} @someProperty={{true}} />',
    '{{some-valid-helper param}}',
    '{{some/valid-nested-helper param}}',
    `{{@someArg}}`,
    `{{this.someProperty}}`,
    `{{#each items as |item|}}
        {{item}}
     {{/each}}`,
    `{{#-in-element}}Hello{{/-in-element}}`,
    `{{#in-element}}Hello{{/in-element}}`,
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
    {
      template: '{{heading size="1" text="Disallowed heading component"}}',
      results: [
        getErrorResult(
          generateError('heading'),
          '{{heading size="1" text="Disallowed heading component"}}'
        ),
      ],
    },
    {
      template: '{{#heading size="1"}}Disallowed heading component{{/heading}}',
      results: [
        getErrorResult(
          generateError('heading'),
          '{{#heading size="1"}}Disallowed heading component{{/heading}}'
        ),
      ],
    },
  ],
});

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    allow: ['some-valid-helper', 'some/valid-nested-helper'],
    disallow: ['heading'],
    requireDash: false,
  },

  good: [
    '<GoodCode />',
    '<GoodCode></GoodCode>',
    '{{if someProperty "yay"}}',
    '<Nested::GoodCode />',
    '<Nested::GoodCode @someProperty={{-50}} @someProperty={{"-50"}}/ />',
    '{{some-valid-helper param}}',
    '{{some/valid-nested-helper param}}',
    `{{@someArg}}`,
    `{{this.someProperty}}`,
    `{{#each items as |item|}}
       {{item}}
     {{/each}}`,
  ],

  bad: [
    {
      template: '{{box}}',
      results: [getErrorResult(generateError('box'), '{{box}}')],
    },
    {
      template: '{{nested/bad-code}}',
      results: [getErrorResult(generateError('nested/bad-code'), '{{nested/bad-code}}')],
    },
    {
      template: '{{heading size="1" text="Disallowed heading component"}}',
      results: [
        getErrorResult(
          generateError('heading'),
          '{{heading size="1" text="Disallowed heading component"}}'
        ),
      ],
    },
    {
      template: '{{#heading size="1"}}Disallowed heading component{{/heading}}',
      results: [
        getErrorResult(
          generateError('heading'),
          '{{#heading size="1"}}Disallowed heading component{{/heading}}'
        ),
      ],
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

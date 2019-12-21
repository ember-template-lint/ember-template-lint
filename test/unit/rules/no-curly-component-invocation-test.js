const generateRuleTests = require('../../helpers/rule-test-harness');
const { transformTagName } = require('../../../lib/helpers/curly-component-invocation');

function generateError(name) {
  let angleBracketName = transformTagName(name);
  return `You are using the component {{${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
}

const SHARED_GOOD = [
  '<GoodCode />',
  '<GoodCode></GoodCode>',
  '{{if someProperty "yay"}}',
  '<Nested::GoodCode />',
  '<Nested::GoodCode @someProperty={{-50}} @someProperty={{"-50"}} @someProperty={{true}} />',
  '{{some-valid-helper param}}',
  '{{some/valid-nested-helper param}}',
  '{{@someArg}}',
  '{{this.someProperty}}',
  `{{#each items as |item|}}
     {{item}}
   {{/each}}`,
  '{{#-in-element}}Hello{{/-in-element}}',
  '{{#in-element}}Hello{{/in-element}}',
  '{{#some-component foo="bar"}}foo{{else}}bar{{/some-component}}',
  '<MyComponent @arg={{my-helper this.foobar}} />',
  '<MyComponent @arg="{{my-helper this.foobar}}" />',
  '<MyComponent {{my-modifier this.foobar}} />',
  '{{svg-jar "status"}}',
  '{{t "some.translation.key"}}',
  '{{#animated-if condition}}foo{{/animated-if}}',
  '{{model.selectedTransfersCount}}',
  '{{request.note}}',
  '{{42}}',
];

const SHARED_BAD = [
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
];

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    allow: ['some-valid-helper', 'some/valid-nested-helper'],
    disallow: ['heading'],
  },

  good: [...SHARED_GOOD],

  bad: [
    ...SHARED_BAD,
    {
      template: '{{bad-code}}',
      results: [getErrorResult(generateError('bad-code'), '{{bad-code}}')],
    },
    {
      template: '<div>{{bad-code}}</div>',
      results: [
        Object.assign(getErrorResult(generateError('bad-code'), '{{bad-code}}'), { column: 5 }),
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

  good: [...SHARED_GOOD, '{{#each items as |item|}}{{item value}}{{/each}}'],

  bad: [
    ...SHARED_BAD,
    {
      template: '{{box}}',
      results: [getErrorResult(generateError('box'), '{{box}}')],
    },
    {
      template: '{{#each items as |item|}} {{item some=args}} {{/each}}',
      results: [getErrorResult(generateError('item'), '{{item some=args}}', 26)],
    },
  ],
});

function getErrorResult(message, source, column = 0) {
  return {
    rule: 'no-curly-component-invocation',
    severity: 2,
    moduleId: 'layout.hbs',
    message,
    line: 1,
    column,
    source,
  };
}

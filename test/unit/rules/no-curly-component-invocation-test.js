const generateRuleTests = require('../../helpers/rule-test-harness');
const { transformTagName } = require('../../../lib/helpers/curly-component-invocation');
const { parseConfig } = require('../../../lib/rules/no-curly-component-invocation');

function generateError(name) {
  let angleBracketName = transformTagName(name);
  return `You are using the component {{${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
}

const SHARED_MOSTLY_GOOD = [
  '{{foo}}',
  '{{foo.bar}}',
  '{{model.selectedTransfersCount}}',
  '{{request.note}}',
];

const SHARED_GOOD = [
  '{{#each items as |item|}}{{item}}{{/each}}',
  '{{42}}',
  '{{true}}',
  '{{undefined}}',
  '{{"foo-bar"}}',
  '{{foo bar}}',
  '<div {{foo}} />',
  '<Foo @bar={{baz}} />',
  '{{#foo bar}}{{/foo}}',
  '{{#foo}}bar{{else}}baz{{/foo}}',

  // real world examples
  '<GoodCode />',
  '<GoodCode></GoodCode>',
  '{{if someProperty "yay"}}',
  '<Nested::GoodCode />',
  '<Nested::GoodCode @someProperty={{-50}} @someProperty={{"-50"}} @someProperty={{true}} />',
  '{{some-valid-helper param}}',
  '{{some/valid-nested-helper param}}',
  '{{@someArg}}',
  '{{this.someProperty}}',
  '{{#-in-element destinationElement}}Hello{{/-in-element}}',
  '{{#in-element destinationElement}}Hello{{/in-element}}',
  '{{#some-component foo="bar"}}foo{{else}}bar{{/some-component}}',
  '<MyComponent @arg={{my-helper this.foobar}} />',
  '<MyComponent @arg="{{my-helper this.foobar}}" />',
  '<MyComponent {{my-modifier this.foobar}} />',
  '{{svg-jar "status"}}',
  '{{t "some.translation.key"}}',
  '{{#animated-if condition}}foo{{/animated-if}}',
];

const SHARED_BAD = [
  {
    template: '{{foo-bar}}',
    results: [
      {
        message: generateError('foo-bar'),
        line: 1,
        column: 0,
        source: '{{foo-bar}}',
      },
    ],
  },
  {
    template: '{{nested/component}}',
    results: [
      {
        message: generateError('nested/component'),
        line: 1,
        column: 0,
        source: '{{nested/component}}',
      },
    ],
  },
  {
    template: '{{foo-bar bar=baz}}',
    results: [
      {
        message: generateError('foo-bar'),
        line: 1,
        column: 0,
        source: '{{foo-bar bar=baz}}',
      },
    ],
  },
  {
    template: '{{foo.bar bar=baz}}',
    results: [
      {
        message: generateError('foo.bar'),
        line: 1,
        column: 0,
        source: '{{foo.bar bar=baz}}',
      },
    ],
  },
  {
    template: '{{link-to "bar" "foo"}}',
    results: [
      {
        message: generateError('link-to'),
        line: 1,
        column: 0,
        source: '{{link-to "bar" "foo"}}',
      },
    ],
  },
  {
    template: '{{#link-to "foo"}}bar{{/link-to}}',
    results: [
      {
        message: generateError('link-to'),
        line: 1,
        column: 0,
        source: '{{#link-to "foo"}}bar{{/link-to}}',
      },
    ],
  },
  {
    template: '{{input type="text" value=this.model.name}}',
    results: [
      {
        message: generateError('input'),
        line: 1,
        column: 0,
        source: '{{input type="text" value=this.model.name}}',
      },
    ],
  },
  {
    template: '{{textarea value=this.model.body}}',
    results: [
      {
        message: generateError('textarea'),
        line: 1,
        column: 0,
        source: '{{textarea value=this.model.body}}',
      },
    ],
  },

  // real world examples
  {
    template: '{{#heading size="1"}}Disallowed heading component{{/heading}}',
    results: [
      {
        message: generateError('heading'),
        line: 1,
        column: 0,
        source: '{{#heading size="1"}}Disallowed heading component{{/heading}}',
      },
    ],
  },
];

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: true,

  good: [...SHARED_MOSTLY_GOOD, ...SHARED_GOOD],
  bad: [...SHARED_BAD],
});

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    requireDash: false,
  },

  good: [...SHARED_MOSTLY_GOOD, ...SHARED_GOOD],
  bad: [...SHARED_BAD],
});

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    disallow: ['disallowed'],
    requireDash: false,
  },

  good: [
    ...SHARED_MOSTLY_GOOD,
    ...SHARED_GOOD,
    '{{#each items as |disallowed|}}{{disallowed}}{{/each}}',
  ],
  bad: [
    ...SHARED_BAD,
    {
      template: '{{disallowed}}',
      results: [
        {
          message: generateError('disallowed'),
          line: 1,
          column: 0,
          source: '{{disallowed}}',
        },
      ],
    },
  ],
});

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    allow: ['aaa-bbb', 'aaa/bbb'],
    requireDash: false,
  },

  good: [
    ...SHARED_MOSTLY_GOOD,
    ...SHARED_GOOD,
    '{{aaa-bbb}}',
    '{{aaa/bbb}}',
    '{{aaa-bbb bar=baz}}',
    '{{#aaa-bbb bar=baz}}{{/aaa-bbb}}',
  ],
  bad: [...SHARED_BAD],
});

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    requireDash: true,
  },

  good: [...SHARED_MOSTLY_GOOD, ...SHARED_GOOD, '{{foo bar=baz}}'],
  bad: [...SHARED_BAD],
});

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    noImplicitThis: true,
  },

  good: [...SHARED_GOOD],
  bad: [
    ...SHARED_BAD,
    {
      template: '{{foo}}',
      results: [
        {
          message: generateError('foo'),
          line: 1,
          column: 0,
          source: '{{foo}}',
        },
      ],
    },
    {
      template: '{{foo.bar}}',
      results: [
        {
          message: generateError('foo.bar'),
          line: 1,
          column: 0,
          source: '{{foo.bar}}',
        },
      ],
    },
  ],
});

describe('no-curly-component-invocation', () => {
  describe('parseConfig', () => {
    const TESTS = [
      [true, { allow: [], disallow: [], requireDash: true, noImplicitThis: false }],
      [
        { allow: ['foo'] },
        { allow: ['foo'], disallow: [], requireDash: true, noImplicitThis: false },
      ],
      [
        { requireDash: false },
        { allow: [], disallow: [], requireDash: false, noImplicitThis: false },
      ],
      [
        { noImplicitThis: true },
        { allow: [], disallow: [], requireDash: true, noImplicitThis: true },
      ],
      [
        { allow: ['foo'], disallow: ['bar', 'baz'], requireDash: false },
        { allow: ['foo'], disallow: ['bar', 'baz'], requireDash: false, noImplicitThis: false },
      ],
    ];

    for (let [input, expected] of TESTS) {
      test(`${JSON.stringify(input)} -> ${JSON.stringify(expected)}`, () => {
        expect(parseConfig(input)).toEqual(expected);
      });
    }

    const FAILURE_TESTS = [undefined, null, false, 'error'];

    for (let input of FAILURE_TESTS) {
      test(`${JSON.stringify(input)} -> Error`, () => {
        expect(() => parseConfig(input)).toThrow();
      });
    }
  });
});

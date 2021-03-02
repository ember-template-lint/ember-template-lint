const { transformTagName } = require('../../../lib/helpers/curly-component-invocation');
const { parseConfig } = require('../../../lib/rules/no-curly-component-invocation');
const generateRuleTests = require('../../helpers/rule-test-harness');

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
  '{{#each items as |item|}}{{item.foo}}{{/each}}',
  '{{42}}',
  '{{true}}',
  '{{undefined}}',
  '{{"foo-bar"}}',
  '{{foo bar}}',
  '<div {{foo}} />',
  '<Foo @bar={{baz}} />',
  '{{#foo bar}}{{/foo}}',
  '{{#foo}}bar{{else}}baz{{/foo}}',

  // single-word no-arguments built-ins
  '{{array}}',
  '{{concat}}',
  '{{debugger}}',
  '{{has-block}}',
  '{{has-block-params}}',
  '{{hasBlock}}',
  '{{hash}}',
  '{{outlet}}',
  '{{yield}}',
  '{{yield to="inverse"}}',

  // ember-cli related addon
  '{{app-version}}',
  '{{app-version versionOnly=true}}',

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
        isFixable: false,
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
        isFixable: false,
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
        isFixable: false,
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
        isFixable: false,
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
        isFixable: false,
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
        isFixable: false,
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
        isFixable: false,
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
        isFixable: false,
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
        isFixable: true,
        source: '{{#heading size="1"}}Disallowed heading component{{/heading}}',
      },
    ],
  },
];

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    requireDash: true,
    noImplicitThis: false,
  },

  good: [...SHARED_MOSTLY_GOOD, ...SHARED_GOOD],
  bad: [...SHARED_BAD],
});

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    requireDash: false,
    noImplicitThis: false,
  },

  good: [...SHARED_MOSTLY_GOOD, ...SHARED_GOOD],
  bad: [...SHARED_BAD],
});

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    disallow: ['disallowed'],
    requireDash: false,
    noImplicitThis: false,
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
          isFixable: false,
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
    noImplicitThis: false,
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
    noImplicitThis: false,
  },

  good: [...SHARED_MOSTLY_GOOD, ...SHARED_GOOD, '{{foo bar=baz}}'],
  bad: [...SHARED_BAD],
});

generateRuleTests({
  name: 'no-curly-component-invocation',

  config: {
    requireDash: false,
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
          isFixable: false,
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
          isFixable: false,
          source: '{{foo.bar}}',
        },
      ],
    },
  ],
});

// fixers tests

generateRuleTests({
  name: 'no-curly-component-invocation',
  config: true,
  bad: [
    {
      template: '{{#foo-bar}}{{/foo-bar}}',
      fixedTemplate: '<FooBar></FooBar>',
    },
    {
      template: '{{#foo-bar a=1 b=true c=undefined d=null}}{{/foo-bar}}',
      fixedTemplate: '<FooBar @a={{1}} @b={{true}} @c={{undefined}} @d={{null}}></FooBar>',
    },
    {
      template: '{{#foo-bar tagName=""}}{{/foo-bar}}',
      fixedTemplate: '<FooBar @tagName=""></FooBar>',
    },
    {
      template: '{{#foo-bar tagName=" "}}{{/foo-bar}}',
      fixedTemplate: '<FooBar @tagName=" "></FooBar>',
    },
    {
      template: '{{#foo-bar tagName=(hash tag="")}}{{/foo-bar}}',
      fixedTemplate: '<FooBar @tagName={{hash tag=""}}></FooBar>',
    },
    {
      template: '{{#foo-bar a="str"}}{{/foo-bar}}',
      fixedTemplate: '<FooBar @a="str"></FooBar>',
    },
    {
      template: '{{#foo-bar/baz/boo-foo a="str"}}{{/foo-bar/baz/boo-foo}}',
      fixedTemplate: '<FooBar::Baz::BooFoo @a="str"></FooBar::Baz::BooFoo>',
    },
    {
      template: '{{#foo-bar a=(array 1 2 3)}}{{/foo-bar}}',
      fixedTemplate: '<FooBar @a={{array 1 2 3}}></FooBar>',
    },
    {
      template: '{{#foo-bar as |foo-baz|}}{{foo-baz}}{{/foo-bar}}',
      fixedTemplate: '<FooBar as |foo-baz|>{{foo-baz}}</FooBar>',
    },
    {
      template:
        '{{#foo-bar as |foo-baz|}}{{#foo-baz as |foo-boo|}}{{foo-boo}}{{/foo-baz}}{{/foo-bar}}',
      fixedTemplate: '<FooBar as |foo-baz|><foo-baz as |foo-boo|>{{foo-boo}}</foo-baz></FooBar>',
    },
    {
      template: '{{#foo-bar as |foo-baz|}}{{foos-baz}}{{/foo-bar}}',
      fixedTemplate: '<FooBar as |foo-baz|>{{foos-baz}}</FooBar>',
    },
    {
      template: '{{#this.foo-bar as |foo-baz|}}{{foos-baz}}{{/this.foo-bar}}',
      fixedTemplate: '<this.foo-bar as |foo-baz|>{{foos-baz}}</this.foo-bar>',
    },
    {
      template: '{{#this.fooBar as |foo-baz|}}{{foos-baz}}{{/this.fooBar}}',
      fixedTemplate: '<this.fooBar as |foo-baz|>{{foos-baz}}</this.fooBar>',
    },
    {
      template: '{{#@foo-bar as |foo-baz|}}{{foos-baz}}{{/@foo-bar}}',
      fixedTemplate: '<@foo-bar as |foo-baz|>{{foos-baz}}</@foo-bar>',
    },
    {
      template: '{{#@fooBar as |foo-baz|}}{{foos-baz}}{{/@fooBar}}',
      fixedTemplate: '<@fooBar as |foo-baz|>{{foos-baz}}</@fooBar>',
    },
    {
      template:
        '{{#let (component "foo") as |my-component|}}{{#my-component}}{{/my-component}}{{/let}}',
      fixedTemplate:
        '{{#let (component "foo") as |my-component|}}<my-component></my-component>{{/let}}',
    },
    {
      template:
        "{{#some-thing foo=(concat true null undefined 42 (my-helper value) 'lol-' something ' ' 'wtf')}}{{/some-thing}}",
      fixedTemplate:
        '<SomeThing @foo="truenullundefined42{{my-helper value}}lol-{{something}} wtf"></SomeThing>',
    },
  ],
});

describe('no-curly-component-invocation', () => {
  describe('parseConfig', () => {
    const TESTS = [
      [true, { allow: [], disallow: [], requireDash: false, noImplicitThis: true }],
      [
        { allow: ['foo'] },
        { allow: ['foo'], disallow: [], requireDash: false, noImplicitThis: true },
      ],
      [
        { requireDash: false },
        { allow: [], disallow: [], requireDash: false, noImplicitThis: true },
      ],
      [
        { noImplicitThis: true },
        { allow: [], disallow: [], requireDash: false, noImplicitThis: true },
      ],
      [
        { allow: ['foo'], disallow: ['bar', 'baz'], requireDash: false },
        { allow: ['foo'], disallow: ['bar', 'baz'], requireDash: false, noImplicitThis: true },
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

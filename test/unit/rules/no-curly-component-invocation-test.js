const { parseConfig } = require('../../../lib/rules/no-curly-component-invocation');
const generateRuleTests = require('../../helpers/rule-test-harness');

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
    verifyResults(results) {
      expect(results).toMatchSnapshot();
    },
  },
  {
    template: '{{nested/component}}',
    verifyResults(results) {
      expect(results).toMatchSnapshot();
    },
  },
  {
    template: '{{foo-bar bar=baz}}',
    verifyResults(results) {
      expect(results).toMatchSnapshot();
    },
  },
  {
    template: '{{foo.bar bar=baz}}',
    verifyResults(results) {
      expect(results).toMatchSnapshot();
    },
  },
  {
    template: '{{link-to "bar" "foo"}}',
    verifyResults(results) {
      expect(results).toMatchSnapshot();
    },
  },
  {
    template: '{{#link-to "foo"}}bar{{/link-to}}',
    verifyResults(results) {
      expect(results).toMatchSnapshot();
    },
  },
  {
    template: '{{input type="text" value=this.model.name}}',
    verifyResults(results) {
      expect(results).toMatchSnapshot();
    },
  },
  {
    template: '{{textarea value=this.model.body}}',
    verifyResults(results) {
      expect(results).toMatchSnapshot();
    },
  },

  // real world examples
  {
    template: '{{#heading size="1"}}Disallowed heading component{{/heading}}',
    verifyResults(results) {
      expect(results).toMatchSnapshot();
    },
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
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 14,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "You are using the component {{disallowed}} with curly component syntax. You should use <Disallowed> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['disallowed'] }\`.",
              "rule": "no-curly-component-invocation",
              "severity": 2,
              "source": "{{disallowed}}",
            },
          ]
        `);
      },
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
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 7,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "You are using the component {{foo}} with curly component syntax. You should use <Foo> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['foo'] }\`.",
              "rule": "no-curly-component-invocation",
              "severity": 2,
              "source": "{{foo}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo.bar}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 11,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": false,
              "line": 1,
              "message": "You are using the component {{foo.bar}} with curly component syntax. You should use <Foo.Bar> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['foo.bar'] }\`.",
              "rule": "no-curly-component-invocation",
              "severity": 2,
              "source": "{{foo.bar}}",
            },
          ]
        `);
      },
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

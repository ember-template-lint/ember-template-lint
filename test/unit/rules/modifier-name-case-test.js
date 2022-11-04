import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'modifier-name-case',

  config: true,

  good: [
    '<div {{did-insert}}></div>',
    '<div {{did-insert "something"}}></div>',
    '<div {{did-insert action=something}}></div>',
    '<button {{on "click" somethingAmazing}}></button>',
    '<button onclick={{do-a-thing "foo"}}></button>',
    '<button onclick={{doAThing "foo"}}></button>',
    '<a href="#" onclick={{amazingActionThing "foo"}} {{did-insert}}></a>',
    '<div didInsert></div>',
    '<div {{(modifier "foo-bar")}}></div>',
    '<div {{(if this.foo (modifier "foo-bar"))}}></div>',
    '<div {{(modifier this.fooBar)}}></div>',
  ],

  bad: [
    {
      template: '<div {{didInsert}}></div>',
      fixedTemplate: '<div {{did-insert}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 7,
              "endColumn": 16,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use dasherized names for modifier invocation. Please replace \`didInsert\` with \`did-insert\`.",
              "rule": "modifier-name-case",
              "severity": 2,
              "source": "didInsert",
            },
          ]
        `);
      },
    },
    {
      template: '<div class="monkey" {{didInsert "something" with="somethingElse"}}></div>',
      fixedTemplate: '<div class="monkey" {{did-insert "something" with="somethingElse"}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 22,
              "endColumn": 31,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use dasherized names for modifier invocation. Please replace \`didInsert\` with \`did-insert\`.",
              "rule": "modifier-name-case",
              "severity": 2,
              "source": "didInsert",
            },
          ]
        `);
      },
    },
    {
      template: '<a href="#" onclick={{amazingActionThing "foo"}} {{doSomething}}></a>',
      fixedTemplate: '<a href="#" onclick={{amazingActionThing "foo"}} {{do-something}}></a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 51,
              "endColumn": 62,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use dasherized names for modifier invocation. Please replace \`doSomething\` with \`do-something\`.",
              "rule": "modifier-name-case",
              "severity": 2,
              "source": "doSomething",
            },
          ]
        `);
      },
    },
    {
      template: '<div {{(modifier "fooBar")}}></div>',
      fixedTemplate: '<div {{(modifier "foo-bar")}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 17,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use dasherized names for modifier invocation. Please replace \`fooBar\` with \`foo-bar\`.",
              "rule": "modifier-name-case",
              "severity": 2,
              "source": "\\"fooBar\\"",
            },
          ]
        `);
      },
    },
    {
      template: '<div {{(if this.foo (modifier "fooBar"))}}></div>',
      fixedTemplate: '<div {{(if this.foo (modifier "foo-bar"))}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 30,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Use dasherized names for modifier invocation. Please replace \`fooBar\` with \`foo-bar\`.",
              "rule": "modifier-name-case",
              "severity": 2,
              "source": "\\"fooBar\\"",
            },
          ]
        `);
      },
    },
  ],
});

import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'deprecated-inline-view-helper',

  config: true,

  good: [
    '{{great-fishsticks}}',
    '{{input placeholder=(t "email") value=email}}',
    '{{title "CrossCheck Web" prepend=true separator=" | "}}',
    '{{false}}',
    '{{"foo"}}',
    '{{42}}',
    '{{null}}',
    '{{undefined}}',
    '{{has-block "view"}}',
    '{{yield to="view"}}',
    '{{#if (has-block "view")}}{{yield to="view"}}{{/if}}',
    '{{this.view}}',
    '{{@view}}',
    '{{#let this.prop as |view|}} {{view}} {{/let}}',
  ],

  bad: [
    {
      template: "{{view 'awful-fishsticks'}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{awful-fishsticks}}",
              },
              "line": 1,
              "message": "The inline form of \`view\` is deprecated. Please use the \`Ember.Component\` instead. See the deprecation guide at http://emberjs.com/deprecations/v1.x/#toc_ember-view",
              "rule": "deprecated-inline-view-helper",
              "severity": 2,
              "source": "{{view 'awful-fishsticks'}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{view.bad-fishsticks}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 23,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{bad-fishsticks}}",
              },
              "line": 1,
              "message": "The inline form of \`view\` is deprecated. Please use the \`Ember.Component\` instead. See the deprecation guide at http://emberjs.com/deprecations/v1.x/#toc_ember-view",
              "rule": "deprecated-inline-view-helper",
              "severity": 2,
              "source": "{{view.bad-fishsticks}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{view.terrible.fishsticks}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{terrible.fishsticks}}",
              },
              "line": 1,
              "message": "The inline form of \`view\` is deprecated. Please use the \`Ember.Component\` instead. See the deprecation guide at http://emberjs.com/deprecations/v1.x/#toc_ember-view",
              "rule": "deprecated-inline-view-helper",
              "severity": 2,
              "source": "{{view.terrible.fishsticks}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{foo-bar bab=good baz=view.qux.qaz boo=okay}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "endColumn": 35,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{foo-bar baz=qux.qaz}}",
              },
              "line": 1,
              "message": "The inline form of \`view\` is deprecated. Please use the \`Ember.Component\` instead. See the deprecation guide at http://emberjs.com/deprecations/v1.x/#toc_ember-view",
              "rule": "deprecated-inline-view-helper",
              "severity": 2,
              "source": "{{foo-bar baz=view.qux.qaz}}",
            },
          ]
        `);
      },
    },
    {
      template: '<div class="whatever-class" data-foo={{view.hallo}} sure=thing></div>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 69,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "<div data-foo={{hallo}}></div>",
              },
              "line": 1,
              "message": "The inline form of \`view\` is deprecated. Please use the \`Ember.Component\` instead. See the deprecation guide at http://emberjs.com/deprecations/v1.x/#toc_ember-view",
              "rule": "deprecated-inline-view-helper",
              "severity": 2,
              "source": "<div data-foo={{view.hallo}}></div>",
            },
          ]
        `);
      },
    },
    {
      template: '{{#foo-bar derp=view.whoops thing=whatever}}{{/foo-bar}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{#foo-bar derp=whoops}}{{/foo-bar}}",
              },
              "line": 1,
              "message": "The inline form of \`view\` is deprecated. Please use the \`Ember.Component\` instead. See the deprecation guide at http://emberjs.com/deprecations/v1.x/#toc_ember-view",
              "rule": "deprecated-inline-view-helper",
              "severity": 2,
              "source": "{{#foo-bar derp=view.whoops}}{{/foo-bar}}",
            },
          ]
        `);
      },
    },
  ],
});

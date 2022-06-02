import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-positional-data-test-selectors',
  config: true,
  good: [
    `
      {{#if data-test-foo}}
      {{/if}}
    `,
    `
      <div data-test-blah></div>
    `,
    `
      <Foo data-test-derp />
    `,
    `
      {{something data-test-lol=true}}
    `,
    `
      {{#if dataSomething}}
        <div> hello </div>
      {{/if}}
    `,
    `
      <div
        data-test-msg-connections-typeahead-result={{true}}
      >
      </div>
    `,
    `
      <div
        data-test-msg-connections-typeahead-result="foo-bar"
      >
      </div>
    `,
    `
      {{badge
        data-test-profile-card-one-to-one-connection-distance=true
        degreeText=(t "i18n_distance_v2" distance=recipientDistance)
        degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
      }}
    `,
    `
      {{badge
        data-test-profile-card-one-to-one-connection-distance="foo-bar"
        degreeText=(t "i18n_distance_v2" distance=recipientDistance)
        degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
      }}
    `,
    `
      <div
        data-test-profile=true
      >
        hello
      </div>
    `,
  ],
  bad: [
    {
      template: `
        {{badge
          data-test-profile-card-one-to-one-connection-distance
          degreeText=(t "i18n_distance_v2" distance=recipientDistance)
          degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
        }}
      `,
      fixedTemplate: `
        {{badge
          data-test-profile-card-one-to-one-connection-distance=true
          degreeText=(t "i18n_distance_v2" distance=recipientDistance)
          degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)
        }}
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Passing a \`data-test-*\` positional param to a curly invocation should be avoided.",
              "rule": "no-positional-data-test-selectors",
              "severity": 2,
              "source": "{{badge
                    data-test-profile-card-one-to-one-connection-distance
                    degreeText=(t \\"i18n_distance_v2\\" distance=recipientDistance)
                    degreeA11yText=(t \\"i18n_distance_a11y_v2\\" distance=recipientDistance)
                  }}",
            },
          ]
        `);
      },
    },
  ],
});

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

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
      result: {
        message:
          'Passing a `data-test-*` positional param to a curly invocation should be avoided.',
        line: 2,
        column: 8,
        source:
          '{{badge\n          data-test-profile-card-one-to-one-connection-distance\n          degreeText=(t "i18n_distance_v2" distance=recipientDistance)\n          degreeA11yText=(t "i18n_distance_a11y_v2" distance=recipientDistance)\n        }}',
        isFixable: true,
      },
    },
  ],
});

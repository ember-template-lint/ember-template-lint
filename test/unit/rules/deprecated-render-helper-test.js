'use strict';

const { message } = require('../../../lib/rules/deprecated-render-helper');
const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'deprecated-render-helper',

  config: true,

  good: [
    '{{valid-compoennt}}',
    '{{input placeholder=(t "email") value=email}}',
    '{{title "CrossCheck Web" prepent=true separator=" | "}}',
    '{{hockey-player teamName="Boston Bruins"}}',
    '{{false}}',
    '{{"foo"}}',
    '{{42}}',
    '{{null}}',
    '{{undefined}}',
  ],

  bad: [
    {
      template: "{{render 'ken-griffey'}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{ken-griffey}}",
              },
              "line": 1,
              "message": "The \`{{render}}\` helper is deprecated in favor of using components. Please see the deprecation guide at https://emberjs.com/deprecations/v2.x/#toc_code-render-code-helper.",
              "rule": "deprecated-render-helper",
              "severity": 2,
              "source": "{{render 'ken-griffey'}}",
            },
          ]
        `);
      },
    },
    {
      template: "{{render 'baseball-player' pitcher}}",

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "filePath": "layout.hbs",
              "fix": Object {
                "text": "{{baseball-player model=pitcher}}",
              },
              "line": 1,
              "message": "The \`{{render}}\` helper is deprecated in favor of using components. Please see the deprecation guide at https://emberjs.com/deprecations/v2.x/#toc_code-render-code-helper.",
              "rule": "deprecated-render-helper",
              "severity": 2,
              "source": "{{render 'baseball-player' pitcher}}",
            },
          ]
        `);
      },
    },
  ],
});

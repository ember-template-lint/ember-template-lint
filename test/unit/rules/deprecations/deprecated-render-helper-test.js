'use strict';

const generateRuleTests = require('../../../helpers/rule-test-harness');

const message = require('../../../../lib/rules/deprecations/deprecated-render-helper').message;

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

      result: {
        message,
        source: "{{render 'ken-griffey'}}",
        line: 1,
        column: 0,
        fix: {
          text: '{{ken-griffey}}',
        },
      },
    },
    {
      template: "{{render 'baseball-player' pitcher}}",

      result: {
        message,
        source: "{{render 'baseball-player' pitcher}}",
        line: 1,
        column: 0,
        fix: {
          text: '{{baseball-player model=pitcher}}',
        },
      },
    },
  ],
});

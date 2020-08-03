'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const ERROR_MESSAGE = require('../../../lib/rules/require-valid-form-groups').ERROR_MESSAGE;

generateRuleTests({
  name: 'require-valid-form-groups',

  config: true,

  good: [
    `<fieldset>
      <legend>Preferred Mascot Version</legend>
      <div>
        <label for="radio-001">Chicago Zoey</label>
        <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
      </div>
    </fieldset>`,
    `<div role="group" aria-labelledby="preferred-mascot-heading">
      <div id="preferred-mascot-heading">Preferred Mascot Version</div>
      <label for="radio-001">Chicago Zoey</label>
      <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />
    </div>`,
  ],

  bad: [
    {
      template: '<div><label for="radio-001">Chicago Zoey</label></div>',
      result: {
        moduleId: 'layout',
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '<label for="radio-001">Chicago Zoey</label>',
      },
    },
    {
      template:
        '<div><input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" /></div>',
      result: {
        message: ERROR_MESSAGE,
        line: 1,
        column: 5,
        source: '<input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />',
      },
    },
  ],
});

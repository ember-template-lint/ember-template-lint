import generateRuleTests from '../../helpers/rule-test-harness.js';

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
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 5,
     "endColumn": 48,
     "endLine": 1,
     "filePath": "layout.hbs",
     "line": 1,
     "message": "Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels",
     "rule": "require-valid-form-groups",
     "severity": 2,
     "source": "<label for="radio-001">Chicago Zoey</label>",
   },
 ]
        `);
      },
    },
    {
      template:
        '<div><input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" /></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 5,
     "endColumn": 86,
     "endLine": 1,
     "filePath": "layout.hbs",
     "line": 1,
     "message": "Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels",
     "rule": "require-valid-form-groups",
     "severity": 2,
     "source": "<input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey" />",
   },
 ]
          `);
      },
    },
  ],
});

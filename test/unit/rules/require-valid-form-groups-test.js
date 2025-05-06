import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-valid-form-groups',

  config: true,

  good: [
    `<fieldset>
      <legend>Preferred Mascot Version</legend>
      <div>
        <label for="radio-001">Chicago Zoey</label>
        <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
      </div>
    </fieldset>`,
    `<div role="group" aria-labelledby="preferred-mascot-heading">
      <div id="preferred-mascot-heading">Preferred Mascot Version</div>
      <label for="radio-001">Chicago Zoey</label>
      <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
      <label for="radio-002">Chicago Tom</label>
      <input id="radio-002" type="radio" name="prefMascot-Tom" value="chicago zoey">
    </div>`,
    `<div>
      <label for="radio-001">Chicago Zoey</label>
      <input id="radio-001" type="radio" name="prefMascot-Zoey" value="chicago zoey">
    </div>`,
  ],

  bad: [
    {
      template: '<div><input name="a1">Chicago Zoey<input name="a2">Chicago Tom</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 5,
     "endColumn": 22,
     "endLine": 1,
     "filePath": "layout.hbs",
     "line": 1,
     "message": "Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels",
     "rule": "require-valid-form-groups",
     "severity": 2,
     "source": "<input name="a1">",
   },
   {
     "column": 34,
     "endColumn": 51,
     "endLine": 1,
     "filePath": "layout.hbs",
     "line": 1,
     "message": "Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels",
     "rule": "require-valid-form-groups",
     "severity": 2,
     "source": "<input name="a2">",
   },
 ]
        `);
      },
    },
    {
      template:
        '<div><input id="prefMascot-Zoey"><label for="prefMascot-Zoey" /><input id="prefMascot-tom"><label for="prefMascot-tom" /></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 5,
     "endColumn": 33,
     "endLine": 1,
     "filePath": "layout.hbs",
     "line": 1,
     "message": "Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels",
     "rule": "require-valid-form-groups",
     "severity": 2,
     "source": "<input id="prefMascot-Zoey">",
   },
   {
     "column": 64,
     "endColumn": 91,
     "endLine": 1,
     "filePath": "layout.hbs",
     "line": 1,
     "message": "Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels",
     "rule": "require-valid-form-groups",
     "severity": 2,
     "source": "<input id="prefMascot-tom">",
   },
 ]
          `);
      },
    },
  ],
});

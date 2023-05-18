import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'simple-modifiers',

  config: true,

  good: [
    '<div {{(modifier "track-interaction" @controlName)}}></div>',
    '<div {{(modifier this.trackInteraction @controlName)}}></div>',
    '<div {{(modifier @trackInteraction @controlName)}}></div>',
    '<div {{(if @isActionVisible (modifier "track-interaction" eventName=myEventName eventBody=myEventbody))}}></div>',
    '<div {{(my-modifier (unless this.hasBeenClicked "track-interaction") "click" customizeData=this.customizeClickData)}}></div>',
    '<MyComponent @people={{array "Tom Dale" "Yehuda Katz" this.myOtherPerson}} />',
    '<div {{(if this.foo (modifier "foo-bar"))}}></div>',
  ],

  bad: [
    {
      template:
        '<div {{(modifier (unless this.hasBeenClicked "track-interaction") "click" customizeData=this.customizeClickData)}}></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 17,
              "endColumn": 65,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The modifier helper should have a string or a variable name containing the modifier name as a first argument.",
              "rule": "simple-modifiers",
              "severity": 2,
              "source": "(unless this.hasBeenClicked \\"track-interaction\\")",
            },
          ]
        `);
      },
    },
  ],
});

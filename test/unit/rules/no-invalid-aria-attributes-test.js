import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-invalid-aria-attributes',

  config: true,

  good: [
    '<h1 aria-hidden="true">Valid Heading</h1>',
    '<h1 aria-hidden={{true}}>Second valid Heading</h1>',
    '<input type="email" aria-required="true" />',
    '<input type="text" aria-labelledby="label1 label2" />',
    '<div role="checkbox" aria-checked="true" onclick="handleCheckbox()" tabindex="0"></div>',
    '<button aria-haspopup="true"></button>',
    '<button aria-haspopup="dialog"></button>',
    '<div role="slider" aria-valuenow="50" aria-valuemax="100" aria-valuemin="0" />',
    '<div role="heading" aria-level={{2}}></div>',
    '<input type="text" id="name" aria-invalid="grammar" />',
    '<div role="region" aria-live="polite" aria-relevant="additions text">Valid live region</div>',
    '<div aria-label="{{@foo.bar}} baz"></div>',
    '<CustomComponent @ariaRequired={{this.ariaRequired}} aria-errormessage="errorId" />',
    '<button type="submit" aria-disabled={{this.isDisabled}}>Submit</button>',
    '<div role="textbox" aria-sort={{if this.hasCustomSort "other" "ascending"}}></div>',
    '<div role="combobox" aria-expanded="undefined"></div>',
  ],
  bad: [
    {
      template: '<input aria-text="inaccessible text" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 39,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "aria-text is an unrecognized ARIA attribute.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<input aria-text=\\"inaccessible text\\" />",
            },
          ]
        `);
      },
    },
    {
      template:
        '<div role="slider" aria-valuenow={{this.foo}} aria-valuemax={{this.bar}} aria-value-min={{this.baz}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "aria-value-min is an unrecognized ARIA attribute.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<div role=\\"slider\\" aria-valuenow={{this.foo}} aria-valuemax={{this.bar}} aria-value-min={{this.baz}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<h1 aria--hidden="true">Broken heading</h1>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "aria--hidden is an unrecognized ARIA attribute.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<h1 aria--hidden=\\"true\\">Broken heading</h1>",
            },
          ]
        `);
      },
    },
    {
      template: '<CustomComponent role="region" aria-alert="polite" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 53,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "aria-alert is an unrecognized ARIA attribute.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<CustomComponent role=\\"region\\" aria-alert=\\"polite\\" />",
            },
          ]
        `);
      },
    },
    {
      template:
        '<span role="checkbox" aria-checked="bad-value" tabindex="0" aria-label="Forget me"></span>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 90,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-checked must be a boolean or the string \\"mixed\\".",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<span role=\\"checkbox\\" aria-checked=\\"bad-value\\" tabindex=\\"0\\" aria-label=\\"Forget me\\"></span>",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="submit" disabled="true" aria-disabled="123">Submit</button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 73,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-disabled must be a boolean.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<button type=\\"submit\\" disabled=\\"true\\" aria-disabled=\\"123\\">Submit</button>",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="text" disabled="true" aria-errormessage="false" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 63,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-errormessage must be a string that represents a DOM element ID",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<input type=\\"text\\" disabled=\\"true\\" aria-errormessage=\\"false\\" />",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="password" required="true" aria-errormessage={{0}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 65,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-errormessage must be a string that represents a DOM element ID",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<input type=\\"password\\" required=\\"true\\" aria-errormessage={{0}} />",
            },
          ]
        `);
      },
    },
    {
      template:
        '<button type="submit" aria-describedby="blah false">Continue at your own risk</button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 86,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-describedby must be a list of strings that represent DOM element IDs (idlist)",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<button type=\\"submit\\" aria-describedby=\\"blah false\\">Continue at your own risk</button>",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="submit" aria-describedby={{false}} >broken button</button>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 72,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-describedby must be a list of strings that represent DOM element IDs (idlist)",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<button type=\\"submit\\" aria-describedby={{false}} >broken button</button>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="heading" aria-level="bogus">Inaccessible heading</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 65,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-level must be an integer.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<div role=\\"heading\\" aria-level=\\"bogus\\">Inaccessible heading</div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="heading" aria-level="true">Another inaccessible heading</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 72,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-level must be an integer.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<div role=\\"heading\\" aria-level=\\"true\\">Another inaccessible heading</div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="heading" aria-level={{"blah"}}>Broken heading</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 62,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-level must be an integer.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<div role=\\"heading\\" aria-level={{\\"blah\\"}}>Broken heading</div>",
            },
          ]
        `);
      },
    },
    {
      template:
        '<div role="slider" aria-valuenow=(2*2)  aria-valuemax="100" aria-valuemin="30">Broken slider</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 98,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-valuenow must be a number.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<div role=\\"slider\\" aria-valuenow=(2*2)  aria-valuemax=\\"100\\" aria-valuemin=\\"30\\">Broken slider</div>",
            },
          ]
        `);
      },
    },
    {
      template: '<div role="region" aria-live="no-such-value">Inaccessible live region</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 75,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-live must be a single token from the following: assertive, off, polite.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<div role=\\"region\\" aria-live=\\"no-such-value\\">Inaccessible live region</div>",
            },
          ]
        `);
      },
    },
    {
      template:
        '<div role="region" aria-live="polite" aria-relevant="additions errors">Inaccessible live region</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 101,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-relevant must be a list of one or more tokens from the following: additions, all, removals, text.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<div role=\\"region\\" aria-live=\\"polite\\" aria-relevant=\\"additions errors\\">Inaccessible live region</div>",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="text" aria-required={{if this.foo "true" "woosh"}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 66,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-required must be a boolean.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<input type=\\"text\\" aria-required={{if this.foo \\"true\\" \\"woosh\\"}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="text" aria-required="undefined" />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 47,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The value for aria-required must be a boolean.",
              "rule": "no-invalid-aria-attributes",
              "severity": 2,
              "source": "<input type=\\"text\\" aria-required=\\"undefined\\" />",
            },
          ]
        `);
      },
    },
  ],
});

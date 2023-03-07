import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'require-valid-alt-text',

  config: true,

  good: [
    '<img alt="hullo">',
    '<img alt={{foo}}>',
    '<img alt="blah {{derp}}">',
    '<img aria-hidden="true">',
    '<img hidden>',
    '<img alt="" src="zoey.jpg">',
    '<img alt="" role="none" src="zoey.jpg">',
    '<img alt="" role="presentation" src="zoey.jpg">',
    '<img alt="a stylized graphic of a female hamster" src="zoey.jpg">',
    '<img alt="a stylized graphic of a female hamster" role="presentation" src="zoey.jpg">',

    '<img alt="some-alt-name">',
    '<img alt="name {{picture}}">',
    '<img alt="{{picture}}">',
    '<img alt="">',
    '<img alt="" role="none">',
    '<img alt="" role="presentation">',

    // Valid words containing redundant words.
    '<img alt="logout">',
    '<img alt="photography">',
    '<img alt="picturesque">',
    '<img alt="pilgrimage">',
    '<img alt="spacers">',

    '<img ...attributes>',

    '<input type="image" alt="some-alt">',
    '<input type="image" aria-labelledby="some-alt">',
    '<input type="image" aria-label="some-alt">',
    '<input type="image" hidden>',
    '<input type="image" aria-hidden="true">',

    '<object title="some-alt"></object>',
    '<object role="presentation"></object>',
    '<object role="none"></object>',
    '<object hidden></object>',
    '<object aria-hidden="true"></object>',
    '<object aria-labelledby="some-alt"></object>',
    '<object aria-label="some-alt"></object>',
    '<object>some text</object>',

    '<area alt="some-alt">',
    '<area hidden>',
    '<area aria-hidden="true">',
    '<area aria-labelledby="some-alt">',
    '<area aria-label="some-alt">',
    '<img role={{unless this.altText "presentation"}} alt={{this.altText}}>',
  ],

  bad: [
    {
      template: '<img>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "All \`<img>\` tags must have an alt attribute",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<img>",
            },
          ]
        `);
      },
    },
    {
      template: '<img src="zoey.jpg">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "All \`<img>\` tags must have an alt attribute",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<img src=\\"zoey.jpg\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img alt="path/to/zoey.jpg" src="path/to/zoey.jpg">',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 51,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "The alt text must not be the same as the image source",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<img alt=\\"path/to/zoey.jpg\\" src=\\"path/to/zoey.jpg\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<input type="image">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "All <input> elements with type=\\"image\\" must have a text alternative through the \`alt\`, \`aria-label\`, or \`aria-labelledby\` attribute.",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<input type=\\"image\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<object></object>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Embedded <object> elements must have alternative text by providing inner text, aria-label or aria-labelledby attributes.",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<object></object>",
            },
          ]
        `);
      },
    },
    {
      template: '<object />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 10,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Embedded <object> elements must have alternative text by providing inner text, aria-label or aria-labelledby attributes.",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<object />",
            },
          ]
        `);
      },
    },
    {
      template: '<area>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 6,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Each area of an image map must have a text alternative through the \`alt\`, \`aria-label\`, or \`aria-labelledby\` attribute.",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<area>",
            },
          ]
        `);
      },
    },
    {
      template: '<img alt="picture">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 19,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invalid alt attribute. Words such as \`image\`, \`photo,\` or \`picture\` are already announced by screen readers.",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<img alt=\\"picture\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img alt="photo">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invalid alt attribute. Words such as \`image\`, \`photo,\` or \`picture\` are already announced by screen readers.",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<img alt=\\"photo\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img alt="image">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invalid alt attribute. Words such as \`image\`, \`photo,\` or \`picture\` are already announced by screen readers.",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<img alt=\\"image\\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img alt="  IMAGE ">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 20,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invalid alt attribute. Words such as \`image\`, \`photo,\` or \`picture\` are already announced by screen readers.",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<img alt=\\"  IMAGE \\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img alt="  IMAGE {{picture}} {{word}} ">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 41,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invalid alt attribute. Words such as \`image\`, \`photo,\` or \`picture\` are already announced by screen readers.",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<img alt=\\"  IMAGE {{picture}} {{word}} \\">",
            },
          ]
        `);
      },
    },
    {
      template: '<img alt="52" src="b52.jpg">',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 28,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A number is not valid alt text",
              "rule": "require-valid-alt-text",
              "severity": 2,
              "source": "<img alt=\\"52\\" src=\\"b52.jpg\\">",
            },
          ]
        `);
      },
    },
  ],
});

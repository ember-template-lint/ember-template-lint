import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-action-on-submit-button',

  config: true,

  good: [
    // valid buttons with "button" type
    '<button type="button" />',
    '<button type="button" {{action this.handleClick}} />',
    '<button type="button" {{action this.handleClick on="click"}} />',
    '<button type="button" {{action this.handleMouseover on="mouseOver"}} />',
    '<button type="button" {{on "click" this.handleClick}} />',
    '<button type="button" {{on "mouseover" this.handleMouseover}} />',

    // valid buttons with "submit" type
    '<button />',
    '<button type="submit" />',
    '<button type="submit" {{action this.handleMouseover on="mouseOver"}} />',
    '<button type="submit" {{on "mouseover" this.handleMouseover}} />',

    // valid div elements
    '<div/>',
    '<div></div>',
    '<div type="submit"></div>',
    '<div type="submit" {{action this.handleClick}}></div>',
    '<div type="submit" {{on "click" this.handleClick}}></div>',
  ],

  bad: [
    {
      template: '<button {{action this.handleClick}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 38,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A \`<button>\` with \`type=\\"submit\\"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button {{action this.handleClick}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<button {{action this.handleClick on="click"}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 48,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A \`<button>\` with \`type=\\"submit\\"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button {{action this.handleClick on=\\"click\\"}}/>",
            },
          ]
        `);
      },
    },
    {
      template: '<button {{on "click" this.handleClick}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A \`<button>\` with \`type=\\"submit\\"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button {{on \\"click\\" this.handleClick}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="submit" {{action this.handleClick}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 52,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A \`<button>\` with \`type=\\"submit\\"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type=\\"submit\\" {{action this.handleClick}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="submit" {{action this.handleClick on="click"}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 63,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A \`<button>\` with \`type=\\"submit\\"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type=\\"submit\\" {{action this.handleClick on=\\"click\\"}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="submit" {{action (fn this.someAction "foo")}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 62,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A \`<button>\` with \`type=\\"submit\\"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type=\\"submit\\" {{action (fn this.someAction \\"foo\\")}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="submit" {{on "click" this.handleClick}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 56,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A \`<button>\` with \`type=\\"submit\\"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type=\\"submit\\" {{on \\"click\\" this.handleClick}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<button type="submit" {{on "click" (fn this.addNumber 123)}} />',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 63,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A \`<button>\` with \`type=\\"submit\\"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type=\\"submit\\" {{on \\"click\\" (fn this.addNumber 123)}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<div><button type="submit" {{action this.handleClick}} /></div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 63,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "A \`<button>\` with \`type=\\"submit\\"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type=\\"submit\\" {{action this.handleClick}} />",
            },
          ]
        `);
      },
    },
  ],
});

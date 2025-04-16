import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-action-on-submit-button',

  config: true,

  good: [
    // valid buttons with "button" type, in a form
    '<form><button type="button" /></form>',
    '<form><button type="button" {{action this.handleClick}} /></form>',
    '<form><button type="button" {{action this.handleClick on="click"}} /></form>',
    '<form><button type="button" {{action this.handleMouseover on="mouseOver"}} /></form>',
    '<form><button type="button" {{on "click" this.handleClick}} /></form>',
    '<form><button type="button" {{on "mouseover" this.handleMouseover}} /></form>',

    // valid buttons with "submit" type, in a form
    '<form><button /></form>',
    '<form><button type="submit" /></form>',
    '<form><button type="submit" {{action this.handleMouseover on="mouseOver"}} /></form>',
    '<form><button type="submit" {{on "mouseover" this.handleMouseover}} /></form>',

    // valid div elements, in a form
    '<form><div/></form>',
    '<form><div></div></form>',
    '<form><div type="submit"></div></form>',
    '<form><div type="submit" {{action this.handleClick}}></div></form>',
    '<form><div type="submit" {{on "click" this.handleClick}}></div></form>',

    // valid buttons, only outside a form
    '<button {{action this.handleClick}} />',
    '<button {{action this.handleClick on="click"}}/>',
    '<button {{on "click" this.handleClick}} />',
    '<button type="submit" {{action this.handleClick}} />',
    '<button type="submit" {{action this.handleClick on="click"}} />',
    '<button type="submit" {{action (fn this.someAction "foo")}} />',
    '<button type="submit" {{on "click" this.handleClick}} />',
    '<button type="submit" {{on "click" (fn this.addNumber 123)}} />',
  ],

  bad: [
    {
      template: '<form><button {{action this.handleClick}} /></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 44,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "In a \`<form>\`, a \`<button>\` with \`type="submit"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button {{action this.handleClick}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<form><button {{action this.handleClick on="click"}}/></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 54,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "In a \`<form>\`, a \`<button>\` with \`type="submit"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button {{action this.handleClick on="click"}}/>",
            },
          ]
        `);
      },
    },
    {
      template: '<form><button {{on "click" this.handleClick}} /></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 48,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "In a \`<form>\`, a \`<button>\` with \`type="submit"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button {{on "click" this.handleClick}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<form><button type="submit" {{action this.handleClick}} /></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 58,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "In a \`<form>\`, a \`<button>\` with \`type="submit"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type="submit" {{action this.handleClick}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<form><button type="submit" {{action this.handleClick on="click"}} /></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 69,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "In a \`<form>\`, a \`<button>\` with \`type="submit"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type="submit" {{action this.handleClick on="click"}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<form><button type="submit" {{action (fn this.someAction "foo")}} /></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 68,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "In a \`<form>\`, a \`<button>\` with \`type="submit"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type="submit" {{action (fn this.someAction "foo")}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<form><button type="submit" {{on "click" this.handleClick}} /></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 62,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "In a \`<form>\`, a \`<button>\` with \`type="submit"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type="submit" {{on "click" this.handleClick}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<form><button type="submit" {{on "click" (fn this.addNumber 123)}} /></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 69,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "In a \`<form>\`, a \`<button>\` with \`type="submit"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type="submit" {{on "click" (fn this.addNumber 123)}} />",
            },
          ]
        `);
      },
    },
    {
      template: '<form><div><button type="submit" {{action this.handleClick}} /></div></form>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 11,
              "endColumn": 63,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "In a \`<form>\`, a \`<button>\` with \`type="submit"\` should have no click action",
              "rule": "no-action-on-submit-button",
              "severity": 2,
              "source": "<button type="submit" {{action this.handleClick}} />",
            },
          ]
        `);
      },
    },
  ],
});

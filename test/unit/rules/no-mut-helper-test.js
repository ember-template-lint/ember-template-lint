'use strict';

const { message, generateMessageWithAlternative } = require('../../../lib/rules/no-mut-helper');
const generateRuleTests = require('../../helpers/rule-test-harness');

const setterAlternative = '`{{set}}`';

generateRuleTests({
  name: 'no-mut-helper',

  config: true,

  good: [
    '<MyComponent @toggled={{this.showAggregatedLine}}/>',
    '<MyComponent @toggle={{set this "isDropdownOpen"}}/>',
    '<MyComponent @toggle={{set this "isDropdownOpen"}}/>',
    '<MyComponent @onFocusOut={{action "onFocusOutKeySkillsInput" value="target.value"}}/>',
    '<MyComponent {{on "click" (set this "isDropdownOpen" false)}}/>',
    '<MyComponent {{on "change" this.setContactUsSectionDescription}}/>',
    '<MyComponent {{on "change" (fn this.setContactUsSectionDescription true)}}/>',
    '<MyComponent {{on "change" (action "setContactUsSectionDescription")}}/>',
    '<MyComponent {{on "change" (action "setContactUsSectionDescription" true)}}/>',
    '<MyComponent {{action "setIsDropdownOpen" false}}/>',
    '<MyComponent @dismissModal={{set this "isRequestExpiredModalOpen" false}}/>',
    '<MyComponent onclick={{set this “expandVoluntarySelfIdHelpText” true}}/>',
    '<MyComponent @click={{set this "isCardCollapsed" (if this.isCardCollapsed false true)}}/>',
    '{{my-component click=(set this "isOpen" false)}}',
    '{{my-component click=(set this "isLegalTextExpanded" (not this.isLegalTextExpanded))}}',
    '{{my-component onVisibilityChange=(set this “isDropdownOpen”)}}',
    '{{my-component click=(set this “expandVoluntarySelfIdHelpText” true)}}',
    '{{my-component value=this.secondaryProfileHeadline}}',
    '<div {{mutate this.isDropdownOpen}} class="muted mut">Non-helper substrings with mut in them should not violate this rule.</div>',
  ],

  bad: [
    {
      template: '<MyComponent @toggled={{mut this.showAggregatedLine}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 22,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "{{mut this.showAggregatedLine}}",
            },
          ]
        `);
      },
    },
    {
      template: '{{my-component value=(mut this.secondaryProfileHeadline)}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 21,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.secondaryProfileHeadline)",
            },
          ]
        `);
      },
    },
    {
      template: '<MyComponent {{action (mut this.isDropdownOpen) false}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 22,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.isDropdownOpen)",
            },
          ]
        `);
      },
    },
    {
      template:
        '<MyComponent @dismissModal={{action (mut this.isRequestExpiredModalOpen) false}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 36,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.isRequestExpiredModalOpen)",
            },
          ]
        `);
      },
    },
    {
      template:
        '<MyComponent @click={{action (mut this.isCardCollapsed) (if this.isCardCollapsed false true)}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 29,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.isCardCollapsed)",
            },
          ]
        `);
      },
    },
    {
      template: '<MyComponent onclick={{fn (mut this.expandVoluntarySelfIdHelpText) true}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 26,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.expandVoluntarySelfIdHelpText)",
            },
          ]
        `);
      },
    },
    {
      template: '<MyComponent @onVisibilityChange={{fn (mut this.isDropdownOpen)}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 38,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.isDropdownOpen)",
            },
          ]
        `);
      },
    },
    {
      template: '{{my-component click=(action (mut this.isOpen) false)}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 29,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.isOpen)",
            },
          ]
        `);
      },
    },
    {
      template:
        '{{my-component click=(action (mut this.isLegalTextExpanded) (not this.isLegalTextExpanded))}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 29,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.isLegalTextExpanded)",
            },
          ]
        `);
      },
    },
    {
      template: '{{my-component onVisibilityChange=(action (mut this.isDropdownOpen))}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 42,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.isDropdownOpen)",
            },
          ]
        `);
      },
    },
    {
      template: '{{my-component click=(fn (mut this.showManageEventsModal) true)}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 25,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.showManageEventsModal)",
            },
          ]
        `);
      },
    },
    {
      template: `<MyComponent
          @onVisibilityChange={{action
            (mut this.isDemographicsDropdownOpen)
          }}
        />`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 12,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.isDemographicsDropdownOpen)",
            },
          ]
        `);
      },
    },
    {
      template: `<MyComponent
          @dismissModal={{action
            (mut this.isNotificationsPostApprovalModalOpen)
            false
          }}
        />`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 12,
              "filePath": "layout.hbs",
              "line": 3,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.isNotificationsPostApprovalModalOpen)",
            },
          ]
        `);
      },
    },
    {
      template:
        '<MyComponent onchange={{action (mut this.contactUsSection.description) value="target.value"}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 31,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.contactUsSection.description)",
            },
          ]
        `);
      },
    },
    {
      config: {
        setterAlternative,
      },
      template:
        '<MyComponent onchange={{action (mut this.contactUsSection.description) value="target.value"}}/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 31,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Unexpected usage of mut helper. If using mut as a setter, consider using a JS action or \`{{set}}\` instead.",
              "rule": "no-mut-helper",
              "severity": 2,
              "source": "(mut this.contactUsSection.description)",
            },
          ]
        `);
      },
    },
  ],
});

import generateRuleTests from '../../helpers/rule-test-harness.js';

const setterAlternative = '`{{set}}`';

generateRuleTests({
  name: 'no-mut-helper',

  config: true,

  good: [
    '<MyComponent @toggled={{this.showAggregatedLine}}/>',
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
          [
            {
              "column": 22,
              "endColumn": 53,
              "endLine": 1,
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
          [
            {
              "column": 21,
              "endColumn": 56,
              "endLine": 1,
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
          [
            {
              "column": 22,
              "endColumn": 47,
              "endLine": 1,
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
          [
            {
              "column": 36,
              "endColumn": 72,
              "endLine": 1,
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
          [
            {
              "column": 29,
              "endColumn": 55,
              "endLine": 1,
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
          [
            {
              "column": 26,
              "endColumn": 66,
              "endLine": 1,
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
          [
            {
              "column": 38,
              "endColumn": 63,
              "endLine": 1,
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
          [
            {
              "column": 29,
              "endColumn": 46,
              "endLine": 1,
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
          [
            {
              "column": 29,
              "endColumn": 59,
              "endLine": 1,
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
          [
            {
              "column": 42,
              "endColumn": 67,
              "endLine": 1,
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
          [
            {
              "column": 25,
              "endColumn": 57,
              "endLine": 1,
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
          [
            {
              "column": 12,
              "endColumn": 49,
              "endLine": 3,
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
          [
            {
              "column": 12,
              "endColumn": 59,
              "endLine": 3,
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
          [
            {
              "column": 31,
              "endColumn": 70,
              "endLine": 1,
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
          [
            {
              "column": 31,
              "endColumn": 70,
              "endLine": 1,
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

import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'sort-invocations',

  config: true,

  good: [
    {
      template: '',
    },
    {
      template: `
        <Ui::Button />

        <Ui::Button>
          Submit form
        </Ui::Button>

        {{ui/button}}

        {{#ui/button}}
          Submit form
        {{/ui/button}}
      `,
    },
    {
      template: `
        <Ui::Button
          @label="Submit form"
          @type="submit"
          data-test-button
          {{on "click" this.doSomething}}
          ...attributes
        />
      `,
    },
    {
      template: `
        <Ui::Button
          @isDisabled={{true}}
          @label="Submit form"
          @type="submit"
          class="ui-button disabled"
          data-cucumber-button="Submit form"
          data-test-button
          {{on "click" this.doSomething}}
          ...attributes
        />
      `,
    },
    {
      template: `
        <Ui::Button
          @isDisabled={{not this.enableSubmit}}
          @label="Submit form"
          @type="submit"
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          data-cucumber-button="Submit form"
          data-test-button
          {{autofocus}}
          {{on "click" @onSubmit}}
          ...attributes
        />
      `,
    },
    {
      template: `
        <MyComponent
          @description={{if
            this.someCondition
            (t
              "my-component.description.version-1"
              installedOn=this.installationDate
              packageName="ember-source"
              packageVersion="6.0.0"
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageName="ember-source"
                packageVersion="6.0.0"
              )
            )
          }}
          @title="Update history"
        />
      `,
    },
    {
      template: `
        <Ui::Button
          {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
          @isDisabled={{not this.enableSubmit}}
          @label="Submit form"
          @type="submit"
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          data-cucumber-button="Submit form"
          data-test-button
          {{autofocus}}
          {{! @glint-expect-error: @onSubmit has incorrect type }}
          {{on "click" @onSubmit}}
          ...attributes
        />
      `,
    },
    {
      template: `
        <this.MyButton
          @label="Submit form"
          @type="submit"
          data-test-button
          {{on "click" this.doSomething}}
          ...attributes
        />
      `,
    },
    {
      template: `
        {{component
          "ui/button"
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-cucumber-button="Submit form"
          data-test-button=""
          isDisabled=(not this.enableSubmit)
          label="Submit form"
          onClick=@onSubmit
          type="submit"
        }}
      `,
    },
    {
      template: `
        <button
          class={{local this.styles "button" "disabled"}}
          data-cucumber-button="Submit form"
          data-test-button
          disabled
          type="submit"
          {{autofocus}}
          {{on "click" @onSubmit}}
          ...attributes
        >
          Submit form
        </button>

        <div
          class={{local
            this.styles
            "button"
            (if this.isFocused "focused")
          }}
          role="button"
          {{on "click" this.submitForm}}
          {{on "click" this.trackEvent}}
          {{on "mouseenter" (fn this.setFocus true)}}
          {{on "mouseleave" (fn this.setFocus false)}}
        >
          Submit form
        </div>
      `,
    },
    {
      template: `
        <MyComponent
        >
          <div
          >
            <span class={{this.styles.highlight}}>
            Hello world!
            </span>
          </div>
        </MyComponent>
      `,
    },
  ],

  bad: [
    {
      template: `
        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <Ui::Button
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button=""
        >
          Submit form
        </Ui::Button>

        {{ui/button
          onclick=this.doSomething
          type="submit"
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          onclick=this.doSomething
          type="submit"
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      `,
      fixedTemplate: `
        <Ui::Button
          @label="Submit form" @type="submit" data-test-button {{on "click" this.doSomething}} ...attributes
        />

        <Ui::Button
          @type="submit" data-test-button={{""}} {{on "click" this.doSomething}} ...attributes
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-test-button=""
          label="Submit form"
          onclick=this.doSomething
          type="submit"
        }}

        {{#ui/button
          data-test-button=""
          onclick=this.doSomething
          type="submit"
        }}
          Submit form
        {{/ui/button}}
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 8,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`...attributes\` must appear after \`data-test-button\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    {{on "click" this.doSomething}}
                    @type="submit"
                    ...attributes
                    data-test-button
                    @label="Submit form"
                  />",
            },
            {
              "column": 8,
              "endColumn": 21,
              "endLine": 17,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 10,
              "message": "\`...attributes\` must appear after \`data-test-button\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    {{on "click" this.doSomething}}
                    @type="submit"
                    ...attributes
                    data-test-button=""
                  >
                    Submit form
                  </Ui::Button>",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 24,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 19,
              "message": "\`type\` must appear after \`data-test-button\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{ui/button
                    onclick=this.doSomething
                    type="submit"
                    data-test-button=""
                    label="Submit form"
                  }}",
            },
            {
              "column": 8,
              "endColumn": 22,
              "endLine": 32,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 26,
              "message": "\`type\` must appear after \`data-test-button\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{#ui/button
                    onclick=this.doSomething
                    type="submit"
                    data-test-button=""
                  }}
                    Submit form
                  {{/ui/button}}",
            },
          ]
        `);
      },
    },
    {
      template: `
        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" this.doSomething}}
          @type="submit"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" this.doSomething}}
          @type="submit"
          @isDisabled={{true}}
          class="ui-button disabled"
          ...attributes
          data-test-button=""
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          type="submit"
          isDisabled=true
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=this.doSomething
          type="submit"
          isDisabled=true
          class="ui-button disabled"
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      `,
      fixedTemplate: `
        <Ui::Button
          @isDisabled={{true}} @label="Submit form" @type="submit" class="ui-button disabled" data-cucumber-button="Submit form" data-test-button {{on "click" this.doSomething}} ...attributes
        />

        <Ui::Button
          @isDisabled={{true}} @type="submit" class="ui-button disabled" data-cucumber-button="Submit form" data-test-button={{""}} {{on "click" this.doSomething}} ...attributes
        >
          Submit form
        </Ui::Button>

        {{ui/button
          class="ui-button disabled"
          data-cucumber-button="Submit form"
          data-test-button=""
          isDisabled=true
          label="Submit form"
          onclick=this.doSomething
          type="submit"
        }}

        {{#ui/button
          class="ui-button disabled"
          data-cucumber-button="Submit form"
          data-test-button=""
          isDisabled=true
          onclick=this.doSomething
          type="submit"
        }}
          Submit form
        {{/ui/button}}
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`data-cucumber-button\` must appear after \`@type\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    data-cucumber-button="Submit form"
                    {{on "click" this.doSomething}}
                    @type="submit"
                    @isDisabled={{true}}
                    class="ui-button disabled"
                    ...attributes
                    data-test-button
                    @label="Submit form"
                  />",
            },
            {
              "column": 8,
              "endColumn": 21,
              "endLine": 23,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 13,
              "message": "\`data-cucumber-button\` must appear after \`@type\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    data-cucumber-button="Submit form"
                    {{on "click" this.doSomething}}
                    @type="submit"
                    @isDisabled={{true}}
                    class="ui-button disabled"
                    ...attributes
                    data-test-button=""
                  >
                    Submit form
                  </Ui::Button>",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 33,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 25,
              "message": "\`type\` must appear after \`isDisabled\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{ui/button
                    data-cucumber-button="Submit form"
                    onclick=this.doSomething
                    type="submit"
                    isDisabled=true
                    class="ui-button disabled"
                    data-test-button=""
                    label="Submit form"
                  }}",
            },
            {
              "column": 8,
              "endColumn": 22,
              "endLine": 44,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 35,
              "message": "\`type\` must appear after \`isDisabled\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{#ui/button
                    data-cucumber-button="Submit form"
                    onclick=this.doSomething
                    type="submit"
                    isDisabled=true
                    class="ui-button disabled"
                    data-test-button=""
                  }}
                    Submit form
                  {{/ui/button}}",
            },
          ]
        `);
      },
    },
    {
      template: `
        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" @onSubmit}}
          @type="submit"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />

        <Ui::Button
          data-cucumber-button="Submit form"
          {{on "click" @onSubmit}}
          @type="submit"
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button=""
          {{autofocus}}
        >
          Submit form
        </Ui::Button>

        {{ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          type="submit"
          isDisabled=(not this.enableSubmit)
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}

        {{#ui/button
          data-cucumber-button="Submit form"
          onclick=onSubmit
          type="submit"
          isDisabled=(not this.enableSubmit)
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
        }}
          Submit form
        {{/ui/button}}
      `,
      fixedTemplate: `
        <Ui::Button
          @isDisabled={{not this.enableSubmit}} @label="Submit form" @type="submit" class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }} data-cucumber-button="Submit form" data-test-button {{autofocus}} {{on "click" @onSubmit}} ...attributes
        />

        <Ui::Button
          @isDisabled={{not this.enableSubmit}} @type="submit" class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }} data-cucumber-button="Submit form" data-test-button={{""}} {{autofocus}} {{on "click" @onSubmit}} ...attributes
        >
          Submit form
        </Ui::Button>

        {{ui/button
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-cucumber-button="Submit form"
          data-test-button=""
          isDisabled=(not this.enableSubmit)
          label="Submit form"
          onclick=onSubmit
          type="submit"
        }}

        {{#ui/button
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-cucumber-button="Submit form"
          data-test-button=""
          isDisabled=(not this.enableSubmit)
          onclick=onSubmit
          type="submit"
        }}
          Submit form
        {{/ui/button}}
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 16,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`data-cucumber-button\` must appear after \`@type\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    data-cucumber-button="Submit form"
                    {{on "click" @onSubmit}}
                    @type="submit"
                    @isDisabled={{not this.enableSubmit}}
                    class={{local
                      this.styles
                      "button"
                      (unless this.enableSubmit "disabled")
                    }}
                    ...attributes
                    data-test-button
                    @label="Submit form"
                    {{autofocus}}
                  />",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 16,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`{{on}}\` must appear after \`{{autofocus}}\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    data-cucumber-button="Submit form"
                    {{on "click" @onSubmit}}
                    @type="submit"
                    @isDisabled={{not this.enableSubmit}}
                    class={{local
                      this.styles
                      "button"
                      (unless this.enableSubmit "disabled")
                    }}
                    ...attributes
                    data-test-button
                    @label="Submit form"
                    {{autofocus}}
                  />",
            },
            {
              "column": 8,
              "endColumn": 21,
              "endLine": 33,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 18,
              "message": "\`data-cucumber-button\` must appear after \`@type\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    data-cucumber-button="Submit form"
                    {{on "click" @onSubmit}}
                    @type="submit"
                    @isDisabled={{not this.enableSubmit}}
                    class={{local
                      this.styles
                      "button"
                      (unless this.enableSubmit "disabled")
                    }}
                    ...attributes
                    data-test-button=""
                    {{autofocus}}
                  >
                    Submit form
                  </Ui::Button>",
            },
            {
              "column": 8,
              "endColumn": 21,
              "endLine": 33,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 18,
              "message": "\`{{on}}\` must appear after \`{{autofocus}}\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    data-cucumber-button="Submit form"
                    {{on "click" @onSubmit}}
                    @type="submit"
                    @isDisabled={{not this.enableSubmit}}
                    class={{local
                      this.styles
                      "button"
                      (unless this.enableSubmit "disabled")
                    }}
                    ...attributes
                    data-test-button=""
                    {{autofocus}}
                  >
                    Submit form
                  </Ui::Button>",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 47,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 35,
              "message": "\`type\` must appear after \`isDisabled\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{ui/button
                    data-cucumber-button="Submit form"
                    onclick=onSubmit
                    type="submit"
                    isDisabled=(not this.enableSubmit)
                    class=(local
                      this.styles
                      "button"
                      (unless this.enableSubmit "disabled")
                    )
                    data-test-button=""
                    label="Submit form"
                  }}",
            },
            {
              "column": 8,
              "endColumn": 22,
              "endLine": 62,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 49,
              "message": "\`type\` must appear after \`isDisabled\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{#ui/button
                    data-cucumber-button="Submit form"
                    onclick=onSubmit
                    type="submit"
                    isDisabled=(not this.enableSubmit)
                    class=(local
                      this.styles
                      "button"
                      (unless this.enableSubmit "disabled")
                    )
                    data-test-button=""
                  }}
                    Submit form
                  {{/ui/button}}",
            },
          ]
        `);
      },
    },
    {
      template: `
        <MyComponent
          @title="Update history"
          @description={{if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          }}
        />

        {{my-component
          title="Update history"
          description=(if
            this.someCondition
            (t
              "my-component.description.version-1"
              packageVersion="6.0.0"
              packageName="ember-source"
              installedOn=this.installationDate
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageVersion="6.0.0"
                packageName="ember-source"
              )
            )
          )
        }}
      `,
      fixedTemplate: `
        <MyComponent
          @description={{if
            this.someCondition
            (t
              "my-component.description.version-1"
              installedOn=this.installationDate
              packageName="ember-source"
              packageVersion="6.0.0"
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageName="ember-source"
                packageVersion="6.0.0"
              )
            )
          }} @title="Update history"
        />

        {{my-component
          description=(if
            this.someCondition
            (t
              "my-component.description.version-1"
              installedOn=this.installationDate
              packageName="ember-source"
              packageVersion="6.0.0"
            )
            (t
              "my-component.description.version-2"
              (hash
                installedOn=this.installationDate
                packageName="ember-source"
                packageVersion="6.0.0"
              )
            )
          )
          title="Update history"
        }}
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 21,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`@title\` must appear after \`@description\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<MyComponent
                    @title="Update history"
                    @description={{if
                      this.someCondition
                      (t
                        "my-component.description.version-1"
                        packageVersion="6.0.0"
                        packageName="ember-source"
                        installedOn=this.installationDate
                      )
                      (t
                        "my-component.description.version-2"
                        (hash
                          installedOn=this.installationDate
                          packageVersion="6.0.0"
                          packageName="ember-source"
                        )
                      )
                    }}
                  />",
            },
            {
              "column": 12,
              "endColumn": 13,
              "endLine": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 6,
              "message": "\`packageVersion\` must appear after \`packageName\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "(t
                        "my-component.description.version-1"
                        packageVersion="6.0.0"
                        packageName="ember-source"
                        installedOn=this.installationDate
                      )",
            },
            {
              "column": 14,
              "endColumn": 15,
              "endLine": 18,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 14,
              "message": "\`packageVersion\` must appear after \`packageName\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "(hash
                          installedOn=this.installationDate
                          packageVersion="6.0.0"
                          packageName="ember-source"
                        )",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 42,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 23,
              "message": "\`title\` must appear after \`description\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{my-component
                    title="Update history"
                    description=(if
                      this.someCondition
                      (t
                        "my-component.description.version-1"
                        packageVersion="6.0.0"
                        packageName="ember-source"
                        installedOn=this.installationDate
                      )
                      (t
                        "my-component.description.version-2"
                        (hash
                          installedOn=this.installationDate
                          packageVersion="6.0.0"
                          packageName="ember-source"
                        )
                      )
                    )
                  }}",
            },
            {
              "column": 12,
              "endColumn": 13,
              "endLine": 32,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 27,
              "message": "\`packageVersion\` must appear after \`packageName\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "(t
                        "my-component.description.version-1"
                        packageVersion="6.0.0"
                        packageName="ember-source"
                        installedOn=this.installationDate
                      )",
            },
            {
              "column": 14,
              "endColumn": 15,
              "endLine": 39,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 35,
              "message": "\`packageVersion\` must appear after \`packageName\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "(hash
                          installedOn=this.installationDate
                          packageVersion="6.0.0"
                          packageName="ember-source"
                        )",
            },
          ]
        `);
      },
    },
    {
      template: `
        <Ui::Button
          data-cucumber-button="Submit form"
          {{! @glint-expect-error: @onSubmit has incorrect type }}
          {{on "click" @onSubmit}}
          @type="submit"
          {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
          @isDisabled={{not this.enableSubmit}}
          class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }}
          ...attributes
          data-test-button
          @label="Submit form"
          {{autofocus}}
        />
      `,
      fixedTemplate: `
        <Ui::Button
          @isDisabled={{not this.enableSubmit}} @label="Submit form" @type="submit" class={{local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          }} data-cucumber-button="Submit form" data-test-button {{autofocus}} {{on "click" @onSubmit}} ...attributes {{! @glint-expect-error: @onSubmit has incorrect type }} {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
        />
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 18,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`data-cucumber-button\` must appear after \`@type\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    data-cucumber-button="Submit form"
                    {{! @glint-expect-error: @onSubmit has incorrect type }}
                    {{on "click" @onSubmit}}
                    @type="submit"
                    {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
                    @isDisabled={{not this.enableSubmit}}
                    class={{local
                      this.styles
                      "button"
                      (unless this.enableSubmit "disabled")
                    }}
                    ...attributes
                    data-test-button
                    @label="Submit form"
                    {{autofocus}}
                  />",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 18,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`{{on}}\` must appear after \`{{autofocus}}\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Button
                    data-cucumber-button="Submit form"
                    {{! @glint-expect-error: @onSubmit has incorrect type }}
                    {{on "click" @onSubmit}}
                    @type="submit"
                    {{!-- @glint-expect-error: this.enableSubmit has incorrect type --}}
                    @isDisabled={{not this.enableSubmit}}
                    class={{local
                      this.styles
                      "button"
                      (unless this.enableSubmit "disabled")
                    }}
                    ...attributes
                    data-test-button
                    @label="Submit form"
                    {{autofocus}}
                  />",
            },
          ]
        `);
      },
    },
    {
      template: `
        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button
          @label="Submit form"
        />

        <this.MyButton
          {{on "click" this.doSomething}}
          @type="submit"
          ...attributes
          data-test-button
        >
          Submit form
        </this.MyButton>
      `,
      fixedTemplate: `
        <this.MyButton
          @label="Submit form" @type="submit" data-test-button {{on "click" this.doSomething}} ...attributes
        />

        <this.MyButton
          @type="submit" data-test-button {{on "click" this.doSomething}} ...attributes
        >
          Submit form
        </this.MyButton>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 8,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`...attributes\` must appear after \`data-test-button\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<this.MyButton
                    {{on "click" this.doSomething}}
                    @type="submit"
                    ...attributes
                    data-test-button
                    @label="Submit form"
                  />",
            },
            {
              "column": 8,
              "endColumn": 24,
              "endLine": 17,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 10,
              "message": "\`...attributes\` must appear after \`data-test-button\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<this.MyButton
                    {{on "click" this.doSomething}}
                    @type="submit"
                    ...attributes
                    data-test-button
                  >
                    Submit form
                  </this.MyButton>",
            },
          ]
        `);
      },
    },
    {
      template: `
        {{component "ui/button"}}

        {{component "ui/button"
          onClick=this.doSomething
          type="submit"
          data-test-button=""
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=this.doSomething
          type="submit"
          isDisabled=true
          class="ui-button disabled"
          data-test-button=""
          label="Submit form"
        }}

        {{component "ui/button"
          data-cucumber-button="Submit form"
          onClick=@onSubmit
          type="submit"
          isDisabled=(not this.enableSubmit)
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-test-button=""
          label="Submit form"
        }}
      `,
      fixedTemplate: `
        {{component "ui/button"}}

        {{component "ui/button"
          data-test-button=""
          label="Submit form"
          onClick=this.doSomething
          type="submit"
        }}

        {{component "ui/button"
          class="ui-button disabled"
          data-cucumber-button="Submit form"
          data-test-button=""
          isDisabled=true
          label="Submit form"
          onClick=this.doSomething
          type="submit"
        }}

        {{component "ui/button"
          class=(local
            this.styles
            "button"
            (unless this.enableSubmit "disabled")
          )
          data-cucumber-button="Submit form"
          data-test-button=""
          isDisabled=(not this.enableSubmit)
          label="Submit form"
          onClick=@onSubmit
          type="submit"
        }}
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 9,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 4,
              "message": "\`type\` must appear after \`data-test-button\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{component "ui/button"
                    onClick=this.doSomething
                    type="submit"
                    data-test-button=""
                    label="Submit form"
                  }}",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 19,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 11,
              "message": "\`type\` must appear after \`isDisabled\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{component "ui/button"
                    data-cucumber-button="Submit form"
                    onClick=this.doSomething
                    type="submit"
                    isDisabled=true
                    class="ui-button disabled"
                    data-test-button=""
                    label="Submit form"
                  }}",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 33,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 21,
              "message": "\`type\` must appear after \`isDisabled\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "{{component "ui/button"
                    data-cucumber-button="Submit form"
                    onClick=@onSubmit
                    type="submit"
                    isDisabled=(not this.enableSubmit)
                    class=(local
                      this.styles
                      "button"
                      (unless this.enableSubmit "disabled")
                    )
                    data-test-button=""
                    label="Submit form"
                  }}",
            },
          ]
        `);
      },
    },
    {
      template: `
        <button
          data-cucumber-button="Submit form"
          {{on "click" @onSubmit}}
          type="submit"
          disabled
          class={{local this.styles "button" "disabled"}}
          ...attributes
          data-test-button
          {{autofocus}}
        >
          Submit form
        </button>

        <div
          role="button"
          {{on "mouseleave" (fn this.setFocus false)}}
          class={{local
            this.styles
            "button"
            (if this.isFocused "focused")
          }}
          {{on "click" this.trackEvent}}
          {{on "mouseenter" (fn this.setFocus true)}}
          {{on "click" this.submitForm}}
        >
          Submit form
        </div>
      `,
      fixedTemplate: `
        <button
          class={{local this.styles "button" "disabled"}} data-cucumber-button="Submit form" data-test-button disabled type="submit" {{autofocus}} {{on "click" @onSubmit}} ...attributes
        >
          Submit form
        </button>

        <div
          class={{local
            this.styles
            "button"
            (if this.isFocused "focused")
          }} role="button" {{on "click" this.trackEvent}} {{on "click" this.submitForm}} {{on "mouseenter" (fn this.setFocus true)}} {{on "mouseleave" (fn this.setFocus false)}}
        >
          Submit form
        </div>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 17,
              "endLine": 13,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`type\` must appear after \`disabled\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<button
                    data-cucumber-button="Submit form"
                    {{on "click" @onSubmit}}
                    type="submit"
                    disabled
                    class={{local this.styles "button" "disabled"}}
                    ...attributes
                    data-test-button
                    {{autofocus}}
                  >
                    Submit form
                  </button>",
            },
            {
              "column": 8,
              "endColumn": 17,
              "endLine": 13,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`{{on}}\` must appear after \`{{autofocus}}\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<button
                    data-cucumber-button="Submit form"
                    {{on "click" @onSubmit}}
                    type="submit"
                    disabled
                    class={{local this.styles "button" "disabled"}}
                    ...attributes
                    data-test-button
                    {{autofocus}}
                  >
                    Submit form
                  </button>",
            },
            {
              "column": 8,
              "endColumn": 14,
              "endLine": 28,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 15,
              "message": "\`role\` must appear after \`class\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<div
                    role="button"
                    {{on "mouseleave" (fn this.setFocus false)}}
                    class={{local
                      this.styles
                      "button"
                      (if this.isFocused "focused")
                    }}
                    {{on "click" this.trackEvent}}
                    {{on "mouseenter" (fn this.setFocus true)}}
                    {{on "click" this.submitForm}}
                  >
                    Submit form
                  </div>",
            },
            {
              "column": 8,
              "endColumn": 14,
              "endLine": 28,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 15,
              "message": "\`{{on}}\` must appear after \`{{on}}\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<div
                    role="button"
                    {{on "mouseleave" (fn this.setFocus false)}}
                    class={{local
                      this.styles
                      "button"
                      (if this.isFocused "focused")
                    }}
                    {{on "click" this.trackEvent}}
                    {{on "mouseenter" (fn this.setFocus true)}}
                    {{on "click" this.submitForm}}
                  >
                    Submit form
                  </div>",
            },
          ]
        `);
      },
    },
    {
      template: `
        {{#let (unique-id) as |formId|}}
          <form
            class={{this.styles.form}}
            data-test-form={{if @title @title ""}}
            aria-labelledby={{if @title (concat formId "-title")}}
            aria-describedby={{if
              @instructions
              (concat formId "-instructions")
            }}
            {{autofocus}}
            {{on "submit" this.submitForm}}
          >
            <Ui::Form::Information
              @formId={{formId}}
              @title={{@title}}
              @instructions={{@instructions}}
            />

            <ContainerQuery
              @features={{hash wide=(width min=480)}}
              as |CQ|
            >
              {{yield
                (hash
                  Input=(component
                    "ui/form/input"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Textarea=(component
                    "ui/form/textarea"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Number=(component
                    "ui/form/number"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Checkbox=(component
                    "ui/form/checkbox"
                    changeset=this.changeset
                    isInline=true
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Select=(component
                    "ui/form/select"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                )
              }}
            </ContainerQuery>

            <div class={{this.styles.actions}}>
              <button
                type="submit"
                data-test-button="Submit"
                class={{this.styles.submit-button}}
              >
                {{t "components.ui.form.submit"}}
              </button>
            </div>
          </form>
        {{/let}}
      `,
      fixedTemplate: `
        {{#let (unique-id) as |formId|}}
          <form
            aria-describedby={{if
              @instructions
              (concat formId "-instructions")
            }} aria-labelledby={{if @title (concat formId "-title")}} class={{this.styles.form}} data-test-form={{if @title @title ""}} {{autofocus}}
            {{on "submit" this.submitForm}}
          >
            <Ui::Form::Information
              @formId={{formId}} @instructions={{@instructions}} @title={{@title}}
            />

            <ContainerQuery
              @features={{hash wide=(width min=480)}}
              as |CQ|
            >
              {{yield
                (hash
                  Checkbox=(component
                    "ui/form/checkbox"
                    changeset=this.changeset
                    isInline=true
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Input=(component
                    "ui/form/input"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Number=(component
                    "ui/form/number"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Select=(component
                    "ui/form/select"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                  Textarea=(component
                    "ui/form/textarea"
                    changeset=this.changeset
                    isWide=CQ.features.wide
                    onUpdate=this.updateChangeset
                  )
                )
              }}
            </ContainerQuery>

            <div class={{this.styles.actions}}>
              <button
                class={{this.styles.submit-button}} data-test-button="Submit" type="submit"
              >
                {{t "components.ui.form.submit"}}
              </button>
            </div>
          </form>
        {{/let}}
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 10,
              "endColumn": 17,
              "endLine": 70,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "\`data-test-form\` must appear after \`aria-labelledby\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<form
                      class={{this.styles.form}}
                      data-test-form={{if @title @title ""}}
                      aria-labelledby={{if @title (concat formId "-title")}}
                      aria-describedby={{if
                        @instructions
                        (concat formId "-instructions")
                      }}
                      {{autofocus}}
                      {{on "submit" this.submitForm}}
                    >
                      <Ui::Form::Information
                        @formId={{formId}}
                        @title={{@title}}
                        @instructions={{@instructions}}
                      />

                      <ContainerQuery
                        @features={{hash wide=(width min=480)}}
                        as |CQ|
                      >
                        {{yield
                          (hash
                            Input=(component
                              "ui/form/input"
                              changeset=this.changeset
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                            Textarea=(component
                              "ui/form/textarea"
                              changeset=this.changeset
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                            Number=(component
                              "ui/form/number"
                              changeset=this.changeset
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                            Checkbox=(component
                              "ui/form/checkbox"
                              changeset=this.changeset
                              isInline=true
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                            Select=(component
                              "ui/form/select"
                              changeset=this.changeset
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                          )
                        }}
                      </ContainerQuery>

                      <div class={{this.styles.actions}}>
                        <button
                          type="submit"
                          data-test-button="Submit"
                          class={{this.styles.submit-button}}
                        >
                          {{t "components.ui.form.submit"}}
                        </button>
                      </div>
                    </form>",
            },
            {
              "column": 12,
              "endColumn": 14,
              "endLine": 18,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 14,
              "message": "\`@title\` must appear after \`@instructions\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Form::Information
                        @formId={{formId}}
                        @title={{@title}}
                        @instructions={{@instructions}}
                      />",
            },
            {
              "column": 16,
              "endColumn": 17,
              "endLine": 57,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 25,
              "message": "\`Textarea\` must appear after \`Number\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "(hash
                            Input=(component
                              "ui/form/input"
                              changeset=this.changeset
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                            Textarea=(component
                              "ui/form/textarea"
                              changeset=this.changeset
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                            Number=(component
                              "ui/form/number"
                              changeset=this.changeset
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                            Checkbox=(component
                              "ui/form/checkbox"
                              changeset=this.changeset
                              isInline=true
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                            Select=(component
                              "ui/form/select"
                              changeset=this.changeset
                              isWide=CQ.features.wide
                              onUpdate=this.updateChangeset
                            )
                          )",
            },
            {
              "column": 14,
              "endColumn": 23,
              "endLine": 68,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 62,
              "message": "\`type\` must appear after \`data-test-button\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<button
                          type="submit"
                          data-test-button="Submit"
                          class={{this.styles.submit-button}}
                        >
                          {{t "components.ui.form.submit"}}
                        </button>",
            },
          ]
        `);
      },
    },
    {
      template: `
        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          ...attributes
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          ...attributes
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>
      `,
      fixedTemplate: `
        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}} {{on "load" this.doSomething2}} ...attributes
        ></iframe>

        <iframe
          {{did-insert this.doSomething1}}
          {{on "load" this.doSomething2}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          ...attributes
        ></iframe>

        <iframe
          class="full-screen"
          data-test-id="my-iframe"
          id={{@id}}
          src={{this.url}}
          {{did-insert this.doSomething1}} {{on "load" this.doSomething2}} ...attributes
        ></iframe>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 18,
              "endLine": 21,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 17,
              "message": "\`...attributes\` must appear after modifiers",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<iframe
                    ...attributes
                    {{did-insert this.doSomething1}}
                    {{on "load" this.doSomething2}}
                  ></iframe>",
            },
            {
              "column": 8,
              "endColumn": 18,
              "endLine": 52,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 44,
              "message": "\`...attributes\` must appear after modifiers",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<iframe
                    class="full-screen"
                    data-test-id="my-iframe"
                    id={{@id}}
                    src={{this.url}}
                    ...attributes
                    {{did-insert this.doSomething1}}
                    {{on "load" this.doSomething2}}
                  ></iframe>",
            },
          ]
        `);
      },
    },
    {
      template: `
        <Ui::Page
          @title={{"Your product"}}
          {{! @glint-expect-error: Type 'string | null' is not assignable to type 'string'. }}
          @routeName={{this.router.currentRouteName}}
          as |Page|
        >
          {{outlet}}

          {{#if this.someCondition1}}
            <Page.Button @id="products.overview" @icon="rightarrow" @label="" />
          {{else if this.someCondition2}}
            <Page.Button @id="products.product" @icon="" @label="" />
          {{else}}
            <Page.Button
              @id="products.product"
              @icon=""
              @label="
              "
            />
          {{/if}}
        </Ui::Page>
      `,
      fixedTemplate: `
        <Ui::Page
          @routeName={{this.router.currentRouteName}} @title={{"Your product"}} {{! @glint-expect-error: Type 'string | null' is not assignable to type 'string'. }}
          as |Page|
        >
          {{outlet}}

          {{#if this.someCondition1}}
            <Page.Button @icon="rightarrow" @id="products.overview" @label={{""}} />
          {{else if this.someCondition2}}
            <Page.Button @icon={{""}} @id="products.product" @label={{""}} />
          {{else}}
            <Page.Button
              @icon={{""}} @id="products.product" @label="
              "
            />
          {{/if}}
        </Ui::Page>
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 19,
              "endLine": 22,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`@title\` must appear after \`@routeName\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Ui::Page
                    @title={{"Your product"}}
                    {{! @glint-expect-error: Type 'string | null' is not assignable to type 'string'. }}
                    @routeName={{this.router.currentRouteName}}
                    as |Page|
                  >
                    {{outlet}}

                    {{#if this.someCondition1}}
                      <Page.Button @id="products.overview" @icon="rightarrow" @label="" />
                    {{else if this.someCondition2}}
                      <Page.Button @id="products.product" @icon="" @label="" />
                    {{else}}
                      <Page.Button
                        @id="products.product"
                        @icon=""
                        @label="
                        "
                      />
                    {{/if}}
                  </Ui::Page>",
            },
            {
              "column": 12,
              "endColumn": 80,
              "endLine": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 11,
              "message": "\`@id\` must appear after \`@icon\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Page.Button @id="products.overview" @icon="rightarrow" @label="" />",
            },
            {
              "column": 12,
              "endColumn": 69,
              "endLine": 13,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 13,
              "message": "\`@id\` must appear after \`@icon\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Page.Button @id="products.product" @icon="" @label="" />",
            },
            {
              "column": 12,
              "endColumn": 14,
              "endLine": 20,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 15,
              "message": "\`@id\` must appear after \`@icon\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<Page.Button
                        @id="products.product"
                        @icon=""
                        @label="
                        "
                      />",
            },
          ]
        `);
      },
    },
    {
      template: `
        <MyComponent
          @parentContainerId={{concat "#" @parentId}}
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          @style={{concat "." @type "1"}}
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          @className={{concat "a" @typeA "b" @typeB "c" @typeC "d"}}
          aria-describedby="1"
        />

        <input
          type="tel"
          local-class="input {{concat 'flag-' @country}}"
        />

        <MyComponent
          @parentContainerId="#{{@parentId}}"
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          @style=".{{@type}}1"
          @isOpen={{this.isOpen}}
        />

        <MyComponent
          aria-describedby="1"
          @className="a{{@typeA}}b{{@typeB}}c{{@typeC}}d"
        />

        <input
          type="tel"
          local-class="input flag-{{@country}}"
        />
      `,
      fixedTemplate: `
        <MyComponent
          @isOpen={{this.isOpen}} @parentContainerId={{concat "#" @parentId}}
        />

        <MyComponent
          @isOpen={{this.isOpen}} @style={{concat "." @type "1"}}
        />

        <MyComponent
          @className={{concat "a" @typeA "b" @typeB "c" @typeC "d"}}
          aria-describedby="1"
        />

        <input
          local-class="input {{concat 'flag-' @country}}" type="tel"
        />

        <MyComponent
          @isOpen={{this.isOpen}} @parentContainerId="#{{@parentId}}"
        />

        <MyComponent
          @isOpen={{this.isOpen}} @style=".{{@type}}1"
        />

        <MyComponent
          @className="a{{@typeA}}b{{@typeB}}c{{@typeC}}d" aria-describedby="1"
        />

        <input
          local-class="input flag-{{@country}}" type="tel"
        />
      `,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 5,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "\`@parentContainerId\` must appear after \`@isOpen\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<MyComponent
                    @parentContainerId={{concat "#" @parentId}}
                    @isOpen={{this.isOpen}}
                  />",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 10,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 7,
              "message": "\`@style\` must appear after \`@isOpen\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<MyComponent
                    @style={{concat "." @type "1"}}
                    @isOpen={{this.isOpen}}
                  />",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 20,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 17,
              "message": "\`type\` must appear after \`local-class\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<input
                    type="tel"
                    local-class="input {{concat 'flag-' @country}}"
                  />",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 25,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 22,
              "message": "\`@parentContainerId\` must appear after \`@isOpen\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<MyComponent
                    @parentContainerId="#{{@parentId}}"
                    @isOpen={{this.isOpen}}
                  />",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 30,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 27,
              "message": "\`@style\` must appear after \`@isOpen\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<MyComponent
                    @style=".{{@type}}1"
                    @isOpen={{this.isOpen}}
                  />",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 35,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 32,
              "message": "\`aria-describedby\` must appear after \`@className\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<MyComponent
                    aria-describedby="1"
                    @className="a{{@typeA}}b{{@typeB}}c{{@typeC}}d"
                  />",
            },
            {
              "column": 8,
              "endColumn": 10,
              "endLine": 40,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 37,
              "message": "\`type\` must appear after \`local-class\`",
              "rule": "sort-invocations",
              "severity": 2,
              "source": "<input
                    type="tel"
                    local-class="input flag-{{@country}}"
                  />",
            },
          ]
        `);
      },
    },
  ],
});

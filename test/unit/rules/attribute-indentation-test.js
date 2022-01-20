import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'attribute-indentation',

  config: true,

  good: [
    {
      config: {
        indentation: 4,
      },
      template: `<div
    class="test"
>
</div>`,
    },
    {
      config: false,
      template: `<div
 truc=mine>
     </div>`,
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'new-line',
        'as-indentation': 'attribute',
      },
      template: `
      {{#foo
        attribute=this.mine
        as |let|
      }}
      {{/foo}}`,
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'new-line',
        'as-indentation': 'closing-brace',
      },
      template: `
      {{#foo
        attribute=this.mine
      as |let|
      }}
      {{/foo}}`,
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'new-line',
      },
      template:
        '<div' +
        '\n' +
        '  foo={{action' +
        '\n' +
        '    (if' +
        '\n' +
        '      abc' +
        '\n' +
        '      def' +
        '\n' +
        '      ghi)' +
        '\n' +
        '    stuff' +
        '\n' +
        '  }}' +
        '\n' +
        '  baz=qux' +
        '\n' +
        '/>',
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'new-line',
      },
      template:
        '<div' +
        '\n' +
        '  foo={{action' +
        '\n' +
        '    some' +
        '\n' +
        '    stuff' +
        '\n' +
        '  }}' +
        '\n' +
        '  baz=qux' +
        '\n' +
        '/>',
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'last-attribute',
      },
      template:
        '<div' +
        '\n' +
        '  foo={{action' +
        '\n' +
        '    some' +
        '\n' +
        '    stuff' +
        '\n' +
        '  }}' +
        '\n' +
        '  baz=qux/>',
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
        'element-open-end': 'last-attribute',
      },
      template:
        '<div' +
        '\n' +
        '  foo={{action' +
        '\n' +
        '    some' +
        '\n' +
        '    stuff}}' +
        '\n' +
        '  baz=qux/>',
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
        'element-open-end': 'new-line',
      },
      template:
        '<div' +
        '\n' +
        '  foo={{action' +
        '\n' +
        '    some' +
        '\n' +
        '    stuff}}' +
        '\n' +
        '  baz=qux' +
        '\n' +
        '/>',
    },
    {
      config: {
        'element-open-end': 'new-line',
      },
      template:
        '<div' +
        '\n' +
        '  foo={{action' +
        '\n' +
        '    some' +
        '\n' +
        '    stuff' +
        '\n' +
        '  }}' +
        '\n' +
        '  baz=qux' +
        '\n' +
        '/>',
    },
    {
      config: {
        'element-open-end': 'new-line',
      },
      template: '<div' + '\n' + '  foo={{action some stuff}}' + '\n' + '  baz=qux' + '\n' + '/>',
    },
    {
      config: {
        'element-open-end': 'new-line',
      },
      template: '<div' + '\n' + '  foo=bar' + '\n' + '  baz=qux' + '\n' + '/>',
    },
    {
      config: {
        'element-open-end': 'last-attribute',
      },
      template: '<div' + '\n' + '  foo=bar' + '\n' + '  baz=qux/>',
    },
    {
      config: {
        'element-open-end': 'new-line',
      },
      template: '<input' + '\n' + '  foo=bar' + '\n' + '  baz=qux' + '\n' + '>',
    },
    {
      config: {
        'element-open-end': 'last-attribute',
      },
      template: '<input' + '\n' + '  foo=bar' + '\n' + '  baz=qux>',
    },
    {
      config: {
        'mustache-open-end': 'new-line',
      },
      template:
        '{{my-component' +
        '\n' +
        '  foo=bar' +
        '\n' +
        '  baz=qux' +
        '\n' +
        '  my-attr=(component "my-other-component" data=(hash' +
        '\n' +
        '    foo=bar' +
        '\n' +
        '    foo=bar' +
        '\n' +
        '    baz=qux))' +
        '\n' +
        '}}',
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
      },
      template:
        '{{my-component' +
        '\n' +
        '  foo=bar' +
        '\n' +
        '  baz=qux' +
        '\n' +
        '  my-attr=(component "my-other-component" data=(hash' +
        '\n' +
        '    foo=bar' +
        '\n' +
        '    foo=bar' +
        '\n' +
        '    baz=qux))}}',
    },
    // Angle Bracket Invocation
    {
      config: {
        'process-elements': true,
      },
      template:
        '<SiteHeader' +
        '\n' +
        '  @selected={{this.user.country}} as |Option|' +
        '\n' +
        '>{{#each this.availableCountries as |country|}}' +
        '\n' +
        '<Option @value={{country}}>{{country.name}}</Option>' +
        '\n' +
        '{{/each}}' +
        '\n' +
        '</SiteHeader>',
    },
    // Non Block form one line
    '<input disabled>',

    // Non Block with wrong indentation, configuration explicitly off
    {
      config: {
        'process-elements': false,
      },
      template: '<input' + '\n' + 'disabled' + '\n' + '>',
    },
    // Block form multi line
    {
      config: {
        'process-elements': true,
      },
      template: '<a' + '\n' + '  disabled' + '\n' + '>abc' + '\n' + '</a>',
    },
    {
      config: {
        'process-elements': true,
        'element-open-end': 'last-attribute',
      },
      template: '<a' + '\n' + '  disabled>' + '\n' + 'abc' + '\n' + '</a>',
    },
    {
      config: {
        'process-elements': true,
      },
      template:
        '<a' +
        '\n' +
        '  disabled' +
        '\n' +
        '>' +
        '\n' +
        '<span' +
        '\n' +
        '  class="abc"' +
        '\n' +
        '>spam me' +
        '\n' +
        '</span>' +
        '\n' +
        '</a>',
    },
    {
      config: {
        'process-elements': true,
      },
      template:
        '<a' +
        '\n' +
        '  disabled' +
        '\n' +
        '>' +
        '\n' +
        '{{#each' +
        '\n' +
        '  class="abc"' +
        '\n' +
        '}}spam me' +
        '\n' +
        '{{/each}}' +
        '\n' +
        '</a>',
    },
    {
      config: {
        'process-elements': true,
      },
      template:
        '<a' +
        '\n' +
        '  disabled' +
        '\n' +
        '>{{contact-details firstName lastName}}' +
        '\n' +
        '</a>',
    },
    {
      config: {
        'process-elements': true,
      },
      template:
        '<a' +
        '\n' +
        '  disabled={{if' +
        '\n' +
        '    true' +
        '\n' +
        '    (action "mostPowerfulAction" value=target.value)' +
        '\n' +
        '    (action "lessPowerfulAction" value=target.value)' +
        '\n' +
        '  }}' +
        '\n' +
        '>{{contact-details' +
        '\n' +
        '   firstName' +
        '\n' +
        '   lastName' +
        '\n' +
        ' }}' +
        '\n' +
        '</a>',
    },
    {
      config: {
        'process-elements': true,
      },
      template:
        '<a' +
        '\n' +
        '  disabled={{if' +
        '\n' +
        '    true' +
        '\n' +
        '    (action "mostPowerfulAction" value=target.value)' +
        '\n' +
        '    (action "lessPowerfulAction" value=target.value)' +
        '\n' +
        '  }}' +
        '\n' +
        '>{{#contact-details' +
        '\n' +
        '   firstName' +
        '\n' +
        '   lastName' +
        '\n' +
        ' }}{{foo}}{{/contact-details}}' +
        '\n' +
        '</a>',
    },
    {
      config: {
        'process-elements': true,
        'element-open-end': 'last-attribute',
        'mustache-open-end': 'last-attribute',
      },
      template:
        '<a' +
        '\n' +
        '  disabled={{if' +
        '\n' +
        '    true' +
        '\n' +
        '    (action "mostPowerfulAction" value=target.value)' +
        '\n' +
        '    (action "lessPowerfulAction" value=target.value)}}>' +
        '\n' +
        '{{#contact-details' +
        '\n' +
        '  firstName' +
        '\n' +
        '  lastName}}' +
        '\n' +
        ' {{foo}}{{/contact-details}}' +
        '\n' +
        '</a>',
    },
    {
      config: {
        'process-elements': true,
        'element-open-end': 'new-line',
        'mustache-open-end': 'last-attribute',
      },
      template:
        '<a' +
        '\n' +
        '  disabled={{if' +
        '\n' +
        '    true' +
        '\n' +
        '    (action "mostPowerfulAction" value=target.value)' +
        '\n' +
        '    (action "lessPowerfulAction" value=target.value)}}' +
        '\n' +
        '>\n' +
        '  {{#contact-details' +
        '\n' +
        '    firstName' +
        '\n' +
        '    lastName}}' +
        '\n' +
        '  {{foo}}\n' +
        '  {{/contact-details}}' +
        '\n' +
        '</a>',
    },
    {
      config: {
        'process-elements': true,
        'element-open-end': 'last-attribute',
        'mustache-open-end': 'new-line',
      },
      template:
        '<a' +
        '\n' +
        '  disabled={{if' +
        '\n' +
        '    true' +
        '\n' +
        '    (action "mostPowerfulAction" value=target.value)' +
        '\n' +
        '    (action "lessPowerfulAction" value=target.value)' +
        '\n' +
        '  }}>\n' +
        '  {{#contact-details' +
        '\n' +
        '    firstName' +
        '\n' +
        '    lastName' +
        '\n' +
        '  }}' +
        '\n' +
        '   {{foo}}{{/contact-details}}' +
        '\n' +
        '</a>',
    },
    // Self closing single line
    {
      config: {
        'process-elements': true,
      },
      template: '<div disabled />',
    },
    // Self closing multi line
    {
      config: {
        'process-elements': true,
      },
      template: '<div' + '\n' + '  disabled' + '\n' + '/>',
    },
    // Non Block form multi line
    {
      config: {
        'process-elements': true,
      },
      template: '<input' + '\n' + '  disabled' + '\n' + '>',
    },
    {
      config: {
        'process-elements': true,
      },
      template: '<input disabled>',
    },
    // Non Block form multi line
    {
      config: {
        'process-elements': true,
      },
      template:
        '<input' +
        '\n' +
        '  disabled={{action "mostPowerfulAction" value=target.value}}' +
        '\n' +
        '>',
    },
    {
      config: {
        'process-elements': true,
      },
      template:
        '<input' +
        '\n' +
        '  disabled={{if' +
        '\n' +
        '    true' +
        '\n' +
        '    (action "mostPowerfulAction" value=target.value)' +
        '\n' +
        '    (action "lessPowerfulAction" value=target.value)' +
        '\n' +
        '  }}' +
        '\n' +
        '>',
    },
    // Non Block form with no params
    '{{contact-details}}',
    // Default config with open-invocation(< 80 chars)
    // positional params
    '{{contact-details firstName lastName}}',
    // named params
    '{{contact-details firstName=firstName lastName=lastName}}',
    // Non Block form more than the default config characters (> 80 chars)
    {
      config: {
        'open-invocation-max-len': 120,
      },
      template:
        '{{contact-details firstName=firstName lastName=lastName avatarUrl=avatarUrl age=age address=address phoneNo=phoneNo}}',
    },
    // Open-invocation with multiple lines.
    '{{contact-details' +
      '\n' +
      '  firstName=firstName' +
      '\n' +
      '  lastName=lastName' +
      '\n' +
      '}}',
    // positional params
    '{{contact-details' + '\n' + '  firstName' + '\n' + '  lastName' + '\n' + '}}',
    // helper
    '{{if' +
      '\n' +
      '  (or logout.isRunning (not session.isAuthenticated))' +
      '\n' +
      '  "Logging Out..."' +
      '\n' +
      '  "Log Out"' +
      '\n' +
      '}}',
    // helper unfolded
    '{{if' +
      '\n' +
      '  (or ' +
      '\n' +
      '    logout.isRunning' +
      '\n' +
      '    (not session.isAuthenticated)' +
      '\n' +
      '  )' +
      '\n' +
      '  "Logging Out..."' +
      '\n' +
      '  "Log Out"' +
      '\n' +
      '}}',
    // positional null
    '{{contact-null' + '\n' + '  null' + '\n' + '}}',
    // component
    '{{component' + '\n' + '  field' + '\n' + '  action=(action reaction)' + '\n' + '}}',

    // Multiple open-invocations with multiple lines.
    '{{contact-details' +
      '\n' +
      '  firstName=firstName' +
      '\n' +
      '  lastName=lastName' +
      '\n' +
      '}}' +
      '\n' +
      '{{contact-details' +
      '\n' +
      '  firstName=firstName' +
      '\n' +
      '  lastName=lastName' +
      '\n' +
      '}}',
    // with component from hash
    '{{t.body' + '\n' + '  canExpand=true' + '\n' + '}}',
    // with helper
    '{{print-debug' +
      '\n' +
      '  foo=(or' +
      '\n' +
      '    foo' +
      '\n' +
      '    bar' +
      '\n' +
      '  )' +
      '\n' +
      '  baz=baz' +
      '\n' +
      '}}',
    // with positional helper
    '{{print-debug' +
      '\n' +
      '  (hash' +
      '\n' +
      '    foo="bar"' +
      '\n' +
      '  )' +
      '\n' +
      '  title="baz"' +
      '\n' +
      '}}',
    '{{yield' +
      '\n' +
      '  (hash' +
      '\n' +
      '    header=(component "x-very-long-name-header")' +
      '\n' +
      '    body=(component "x-very-long-name-body")' +
      '\n' +
      '  )' +
      '\n' +
      '}}',

    // Block form within 80 characters
    // with positional params
    '{{#contact-details firstName lastName}}' +
      '\n' +
      ' {{contactImage}}' +
      '\n' +
      '{{/contact-details}}',
    // with named params
    '{{#contact-details firstName=firstName lastName=lastName}}' +
      '\n' +
      ' {{contactImage}}' +
      '\n' +
      '{{/contact-details}}',
    // component from hash
    '{{#t.body' +
      '\n' +
      '  canExpand=true' +
      '\n' +
      '  multiRowExpansion=false' +
      '\n' +
      '}}' +
      '\n' +
      '  {{foo}}' +
      '\n' +
      '{{/t.body}}',
    // with block params
    '{{#contact-details firstName=firstName lastName=lastName as |contact|}}' +
      '\n' +
      ' {{contact.fullName}}' +
      '\n' +
      '{{/contact-details}}',
    // component from positional
    '{{#t.body' +
      '\n' +
      '  canExpand=(helper help)' +
      '\n' +
      '  multiRowExpansion=false' +
      '\n' +
      'as |body|' +
      '\n' +
      '}}' +
      '\n' +
      '  {{foo}}' +
      '\n' +
      '{{/t.body}}',
    // with indented block params
    '  {{#t.body' +
      '\n' +
      '    canExpand=(helper help)' +
      '\n' +
      '    multiRowExpansion=false' +
      '\n' +
      '  as |body|' +
      '\n' +
      '  }}' +
      '\n' +
      '    {{foo}}' +
      '\n' +
      '  {{/t.body}}',

    // Block form with open-invocation more than 80 characters
    {
      config: {
        'mustache-open-end': 'last-attribute',
        'open-invocation-max-len': 120,
      },
      template:
        '{{#contact-details firstName=firstName lastName=lastName age=age avatarUrl=avatarUrl as |contact|}}' +
        '\n' +
        ' {{contact.fullName}}' +
        '\n' +
        '{{/contact-details}}',
    },
    // Block form with multiple line invocation
    '{{#contact-details' +
      '\n' +
      '  firstName=firstName' +
      '\n' +
      '  lastName=lastName' +
      '\n' +
      'as |fullName|' +
      '\n' +
      '}}' +
      '\n' +
      '  {{fullName}}' +
      '\n' +
      '{{/contact-details}}',
    // Block form with no params
    '{{#contact-details' +
      '\n' +
      'as |contact|' +
      '\n' +
      '}}' +
      '\n' +
      '  {{contact.fullName}}' +
      '\n' +
      '{{/contact-details}}',
    '<div>\n  <p></p>\n</div>',
    {
      config: {
        'mustache-open-end': 'last-attribute',
      },
      template:
        '{{#contact-details' +
        '\n' +
        '  param0' +
        '\n' +
        '  param1=abc' +
        '\n' +
        '  param2=abc' +
        '\n' +
        'as |ab cd ef  cd ef |}}' +
        '\n' +
        '  {{contact.fullName}}' +
        '\n' +
        '{{/contact-details}}',
    },
    {
      config: {
        'mustache-open-end': 'new-line',
      },
      template:
        '{{#contact-details' +
        '\n' +
        '  param0' +
        '\n' +
        '  param1=abc' +
        '\n' +
        '  param2=abc' +
        '\n' +
        'as |ab cd ef  cd ef |' +
        '\n' +
        '}}' +
        '\n' +
        '  {{contact.fullName}}' +
        '\n' +
        '{{/contact-details}}',
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'new-line',
      },
      template:
        '<div' +
        '\n' +
        '  class="classy"' +
        '\n' +
        '>' +
        '\n' +
        '{{#contact-details' +
        '\n' +
        '  param0' +
        '\n' +
        '  param1=abc' +
        '\n' +
        '  param2=abc' +
        '\n' +
        'as |ab cd ef  cd ef |' +
        '\n' +
        '}}' +
        '\n' +
        '  {{contact.fullName}}' +
        '\n' +
        '{{/contact-details}}' +
        '\n' +
        '</div>',
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
        'element-open-end': 'last-attribute',
      },
      template:
        '<div' +
        '\n' +
        '  class="classy">' +
        '\n' +
        '{{#contact-details' +
        '\n' +
        '  param0' +
        '\n' +
        '  param1=abc' +
        '\n' +
        '  param2=abc' +
        '\n' +
        'as |ab cd ef  cd ef |}}' +
        '\n' +
        '  {{contact.fullName}}' +
        '\n' +
        '{{/contact-details}}' +
        '\n' +
        '</div>',
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
        'element-open-end': 'new-line',
      },
      template:
        '<div' +
        '\n' +
        '  class="classy"' +
        '\n' +
        '>' +
        '\n' +
        '{{#contact-details' +
        '\n' +
        '  param0' +
        '\n' +
        '  param1=abc' +
        '\n' +
        '  param2=abc' +
        '\n' +
        'as |ab cd ef  cd ef |}}' +
        '\n' +
        '  {{contact.fullName}}' +
        '\n' +
        '{{/contact-details}}' +
        '\n' +
        '</div>',
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'last-attribute',
      },
      template:
        '<div' +
        '\n' +
        '  class="classy">' +
        '\n' +
        '{{#contact-details' +
        '\n' +
        '  param0' +
        '\n' +
        '  param1=abc' +
        '\n' +
        '  param2=abc' +
        '\n' +
        'as |ab cd ef  cd ef |' +
        '\n' +
        '}}' +
        '\n' +
        '  {{contact.fullName}}' +
        '\n' +
        '{{/contact-details}}' +
        '\n' +
        '</div>',
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
      },
      template: `
        <SomeThing
          @long-arg={{hash
            foo="bar"}}
        />`,
    },
    {
      config: {
        'mustache-open-end': 'new-line',
      },
      template: `
        <SomeThing
          @long-arg={{hash
            foo="bar"
          }}
        />`,
    },
    {
      template: `
        <SomeThing
          @long-arg={{hash
            foo="bar"
          }}
          data-after-long-arg={{true}}
        />`,
    },
    {
      template: `
        <form
          class='form-signin'
          {{action 'authenticate' email password}}
        >
        </form>`,
    },
    {
      template: `
        <div>
          {{{i18n
            param=true
            otherParam=false
          }}}
        </div>`,
    },
  ],

  bad: [
    {
      config: 'bad-config',
      template: 'test',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "fatal": true,
              "filePath": "layout.hbs",
              "message": "The attribute-indentation rule accepts one of the following values.
            * boolean - \`true\` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.,  * { open-invocation-max-len: n characters, indentation: m  } - n : The max length of the opening invocation can be configured,  *                                                            - m : The desired indentation of attribute,  * { process-elements: \`boolean\` } - \`true\` : Also parse HTML/SVG attributes,  * { element-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing brace \`>\` to be on a new line or next to the last attribute (defaults to \`new-line\`),  * { mustache-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing braces \`}}\` to be on a new line or next to the last attribute (defaults to \`new-line\`)
          You specified \`\\"bad-config\\"\`",
              "severity": 2,
              "source": "Error: The attribute-indentation rule accepts one of the following values.
            * boolean - \`true\` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.,  * { open-invocation-max-len: n characters, indentation: m  } - n : The max length of the opening invocation can be configured,  *                                                            - m : The desired indentation of attribute,  * { process-elements: \`boolean\` } - \`true\` : Also parse HTML/SVG attributes,  * { element-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing brace \`>\` to be on a new line or next to the last attribute (defaults to \`new-line\`),  * { mustache-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing braces \`}}\` to be on a new line or next to the last attribute (defaults to \`new-line\`)
          You specified \`\\"bad-config\\"\`
              at AttributeIndentation.parseConfig (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/attribute-indentation.js:813:11)
              at new default (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/_base.js:58:24)
              at new AttributeIndentation (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/attribute-indentation.js:41:16)
              at Linter._buildRule (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:112:16)
              at Linter.buildRules (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:152:25)
              at Linter.verify (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:327:36)
              at Object.<anonymous> (/Users/vincentmolinie/Projects/ember-template-lint/lib/helpers/rule-test-harness.js:420:35)",
            },
          ]
        `);
      },
    },
    {
      config: { 'mustache-open-end': 'wrong-value' },
      template: 'test',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "fatal": true,
              "filePath": "layout.hbs",
              "message": "The attribute-indentation rule accepts one of the following values.
            * boolean - \`true\` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.,  * { open-invocation-max-len: n characters, indentation: m  } - n : The max length of the opening invocation can be configured,  *                                                            - m : The desired indentation of attribute,  * { process-elements: \`boolean\` } - \`true\` : Also parse HTML/SVG attributes,  * { element-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing brace \`>\` to be on a new line or next to the last attribute (defaults to \`new-line\`),  * { mustache-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing braces \`}}\` to be on a new line or next to the last attribute (defaults to \`new-line\`)
          You specified \`{\\"mustache-open-end\\":\\"wrong-value\\"}\`",
              "severity": 2,
              "source": "Error: The attribute-indentation rule accepts one of the following values.
            * boolean - \`true\` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.,  * { open-invocation-max-len: n characters, indentation: m  } - n : The max length of the opening invocation can be configured,  *                                                            - m : The desired indentation of attribute,  * { process-elements: \`boolean\` } - \`true\` : Also parse HTML/SVG attributes,  * { element-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing brace \`>\` to be on a new line or next to the last attribute (defaults to \`new-line\`),  * { mustache-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing braces \`}}\` to be on a new line or next to the last attribute (defaults to \`new-line\`)
          You specified \`{\\"mustache-open-end\\":\\"wrong-value\\"}\`
              at AttributeIndentation.parseConfig (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/attribute-indentation.js:813:11)
              at new default (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/_base.js:58:24)
              at new AttributeIndentation (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/attribute-indentation.js:41:16)
              at Linter._buildRule (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:112:16)
              at Linter.buildRules (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:152:25)
              at Linter.verify (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:327:36)
              at Object.<anonymous> (/Users/vincentmolinie/Projects/ember-template-lint/lib/helpers/rule-test-harness.js:420:35)",
            },
          ]
        `);
      },
    },
    {
      config: { 'element-open-end': 'wrong-value' },
      template: 'test',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "fatal": true,
              "filePath": "layout.hbs",
              "message": "The attribute-indentation rule accepts one of the following values.
            * boolean - \`true\` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.,  * { open-invocation-max-len: n characters, indentation: m  } - n : The max length of the opening invocation can be configured,  *                                                            - m : The desired indentation of attribute,  * { process-elements: \`boolean\` } - \`true\` : Also parse HTML/SVG attributes,  * { element-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing brace \`>\` to be on a new line or next to the last attribute (defaults to \`new-line\`),  * { mustache-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing braces \`}}\` to be on a new line or next to the last attribute (defaults to \`new-line\`)
          You specified \`{\\"element-open-end\\":\\"wrong-value\\"}\`",
              "severity": 2,
              "source": "Error: The attribute-indentation rule accepts one of the following values.
            * boolean - \`true\` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.,  * { open-invocation-max-len: n characters, indentation: m  } - n : The max length of the opening invocation can be configured,  *                                                            - m : The desired indentation of attribute,  * { process-elements: \`boolean\` } - \`true\` : Also parse HTML/SVG attributes,  * { element-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing brace \`>\` to be on a new line or next to the last attribute (defaults to \`new-line\`),  * { mustache-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing braces \`}}\` to be on a new line or next to the last attribute (defaults to \`new-line\`)
          You specified \`{\\"element-open-end\\":\\"wrong-value\\"}\`
              at AttributeIndentation.parseConfig (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/attribute-indentation.js:813:11)
              at new default (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/_base.js:58:24)
              at new AttributeIndentation (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/attribute-indentation.js:41:16)
              at Linter._buildRule (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:112:16)
              at Linter.buildRules (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:152:25)
              at Linter.verify (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:327:36)
              at Object.<anonymous> (/Users/vincentmolinie/Projects/ember-template-lint/lib/helpers/rule-test-harness.js:420:35)",
            },
          ]
        `);
      },
    },
    {
      config: { 'as-indentation': 'wrong-value' },
      template: 'test',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "fatal": true,
              "filePath": "layout.hbs",
              "message": "The attribute-indentation rule accepts one of the following values.
            * boolean - \`true\` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.,  * { open-invocation-max-len: n characters, indentation: m  } - n : The max length of the opening invocation can be configured,  *                                                            - m : The desired indentation of attribute,  * { process-elements: \`boolean\` } - \`true\` : Also parse HTML/SVG attributes,  * { element-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing brace \`>\` to be on a new line or next to the last attribute (defaults to \`new-line\`),  * { mustache-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing braces \`}}\` to be on a new line or next to the last attribute (defaults to \`new-line\`)
          You specified \`{\\"as-indentation\\":\\"wrong-value\\"}\`",
              "severity": 2,
              "source": "Error: The attribute-indentation rule accepts one of the following values.
            * boolean - \`true\` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.,  * { open-invocation-max-len: n characters, indentation: m  } - n : The max length of the opening invocation can be configured,  *                                                            - m : The desired indentation of attribute,  * { process-elements: \`boolean\` } - \`true\` : Also parse HTML/SVG attributes,  * { element-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing brace \`>\` to be on a new line or next to the last attribute (defaults to \`new-line\`),  * { mustache-open-end: \`new-line\`|\`last-attribute\` } - Enforce the position of the closing braces \`}}\` to be on a new line or next to the last attribute (defaults to \`new-line\`)
          You specified \`{\\"as-indentation\\":\\"wrong-value\\"}\`
              at AttributeIndentation.parseConfig (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/attribute-indentation.js:813:11)
              at new default (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/_base.js:58:24)
              at new AttributeIndentation (/Users/vincentmolinie/Projects/ember-template-lint/lib/rules/attribute-indentation.js:41:16)
              at Linter._buildRule (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:112:16)
              at Linter.buildRules (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:152:25)
              at Linter.verify (/Users/vincentmolinie/Projects/ember-template-lint/lib/linter.js:327:36)
              at Object.<anonymous> (/Users/vincentmolinie/Projects/ember-template-lint/lib/helpers/rule-test-harness.js:420:35)",
            },
          ]
        `);
      },
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'new-line',
        'open-invocation-max-len': 20,
      },
      template: `
<div
  foo={{action
    some
    stuff}}
  baz=qux/>`,
      fixedTemplate: `
<div
  foo={{action
    some
    stuff
  }}
  baz=qux
/>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 9,
              "endColumn": 11,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 6,
              "message": "Incorrect indentation of close bracket '>' for the element '<div>' beginning at L6:C9. Expected '<div>' to be at L7:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div
            foo={{action
              some
              stuff}}
            baz=qux/>",
            },
            Object {
              "column": 9,
              "endColumn": 11,
              "endLine": 5,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 5,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{action}}' beginning at L5:C9. Expected '{{action}}' to be at L6:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{action
              some
              stuff}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
        'element-open-end': 'last-attribute',
        'open-invocation-max-len': 20,
      },
      template: `
<div
  foo={{action
    some
    stuff
  }}
  baz=qux
/>`,
      fixedTemplate: `
<div
  foo={{action
    some
    stuff}}
  baz=qux/>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 2,
              "endLine": 8,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 8,
              "message": "Incorrect indentation of close bracket '>' for the element '<div>' beginning at L8:C0. Expected '<div>' to be at L7:C9.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div
            foo={{action
              some
              stuff
            }}
            baz=qux
          />",
            },
            Object {
              "column": 2,
              "endColumn": 4,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 6,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{action}}' beginning at L6:C2. Expected '{{action}}' to be at L5:C9.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{action
              some
              stuff
            }}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
      },
      template: `
{{my-component
  foo=bar
  baz=qux
  my-attr=(component "my-other-component" data=(hash
    foo=bar
    foo=bar
    baz=qux))
}}`,
      fixedTemplate: `
{{my-component
  foo=bar
  baz=qux
  my-attr=(component "my-other-component" data=(hash
    foo=bar
    foo=bar
    baz=qux))}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 2,
              "endLine": 9,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 9,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{my-component}}' beginning at L9:C0. Expected '{{my-component}}' to be at L8:C13.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{my-component
            foo=bar
            baz=qux
            my-attr=(component \\"my-other-component\\" data=(hash
              foo=bar
              foo=bar
              baz=qux))
          }}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'mustache-open-end': 'new-line',
      },
      template: `
{{my-component
  foo=bar
  baz=qux
  my-attr=(component "my-other-component" data=(hash
    foo=bar
    foo=bar
    baz=qux))}}`,
      fixedTemplate: `
{{my-component
  foo=bar
  baz=qux
  my-attr=(component "my-other-component" data=(hash
    foo=bar
    foo=bar
    baz=qux))
}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "endColumn": 15,
              "endLine": 8,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 8,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{my-component}}' beginning at L8:C13. Expected '{{my-component}}' to be at L9:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{my-component
            foo=bar
            baz=qux
            my-attr=(component \\"my-other-component\\" data=(hash
              foo=bar
              foo=bar
              baz=qux))}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'element-open-end': 'last-attribute',
      },
      template: '<input' + '\n' + '  foo=bar' + '\n' + '  baz=bar' + '\n' + '>',
      fixedTemplate: '<input\n  foo=bar\n  baz=bar>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 1,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 4,
              "message": "Incorrect indentation of close bracket '>' for the element '<input>' beginning at L4:C0. Expected '<input>' to be at L3:C9.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input
            foo=bar
            baz=bar
          >",
            },
          ]
        `);
      },
    },
    {
      config: {
        'element-open-end': 'new-line',
      },
      template: '<input' + '\n' + '  foo=bar' + '\n' + '  baz=qux>',
      fixedTemplate: '<input\n  foo=bar\n  baz=qux\n>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 9,
              "endColumn": 10,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Incorrect indentation of close bracket '>' for the element '<input>' beginning at L3:C9. Expected '<input>' to be at L4:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input
            foo=bar
            baz=qux>",
            },
          ]
        `);
      },
    },
    {
      // Non Block HTML element
      config: {
        'process-elements': true,
      },
      template: '<input disabled' + '\n' + '>',
      fixedTemplate: '<input\n  disabled\n>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 1,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'disabled' beginning at L1:C7. Expected 'disabled' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input disabled
          >",
            },
            Object {
              "column": 0,
              "endColumn": 1,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of close bracket '>' for the element '<input>' beginning at L2:C0. Expected '<input>' to be at L3:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input disabled
          >",
            },
          ]
        `);
      },
    },
    {
      // Self closing element
      config: {
        'process-elements': true,
      },
      template: '<div disabled' + '\n' + '/>',
      fixedTemplate: '<div\n  disabled\n/>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 2,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'disabled' beginning at L1:C5. Expected 'disabled' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div disabled
          />",
            },
            Object {
              "column": 0,
              "endColumn": 2,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of close bracket '>' for the element '<div>' beginning at L2:C0. Expected '<div>' to be at L3:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div disabled
          />",
            },
          ]
        `);
      },
    },
    {
      // Too long for 80 characters line
      config: {
        'process-elements': true,
      },
      template:
        '<input disabled type="text" value="abc" class="classy classic classist" id="input-now">',
      fixedTemplate:
        '<input\n  disabled\n  type="text"\n  value="abc"\n  class="classy classic classist"\n  id="input-now"\n>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 87,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'disabled' beginning at L1:C7. Expected 'disabled' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input disabled type=\\"text\\" value=\\"abc\\" class=\\"classy classic classist\\" id=\\"input-now\\">",
            },
            Object {
              "column": 16,
              "endColumn": 87,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'type' beginning at L1:C16. Expected 'type' to be at L3:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input disabled type=\\"text\\" value=\\"abc\\" class=\\"classy classic classist\\" id=\\"input-now\\">",
            },
            Object {
              "column": 28,
              "endColumn": 87,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'value' beginning at L1:C28. Expected 'value' to be at L4:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input disabled type=\\"text\\" value=\\"abc\\" class=\\"classy classic classist\\" id=\\"input-now\\">",
            },
            Object {
              "column": 40,
              "endColumn": 87,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'class' beginning at L1:C40. Expected 'class' to be at L5:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input disabled type=\\"text\\" value=\\"abc\\" class=\\"classy classic classist\\" id=\\"input-now\\">",
            },
            Object {
              "column": 72,
              "endColumn": 87,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'id' beginning at L1:C72. Expected 'id' to be at L6:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input disabled type=\\"text\\" value=\\"abc\\" class=\\"classy classic classist\\" id=\\"input-now\\">",
            },
            Object {
              "column": 86,
              "endColumn": 87,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of close bracket '>' for the element '<input>' beginning at L1:C86. Expected '<input>' to be at L7:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<input disabled type=\\"text\\" value=\\"abc\\" class=\\"classy classic classist\\" id=\\"input-now\\">",
            },
          ]
        `);
      },
    },
    {
      config: {
        'process-elements': true,
      },
      template: `<a
  disabled={{if
    true
    (action "mostPowerfulAction" value=target.value)
    (action "lessPowerfulAction" value=target.value)
  }}
>{{contact-details
   firstName
   lastName
 }}</a>`,
      fixedTemplate: `<a
  disabled={{if
    true
    (action "mostPowerfulAction" value=target.value)
    (action "lessPowerfulAction" value=target.value)
  }}
>{{contact-details
   firstName
   lastName
 }}
</a>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 3,
              "endColumn": 7,
              "endLine": 10,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 10,
              "message": "Incorrect indentation of close tag '</a>' for element '<a>' beginning at L10:C3. Expected '</a>' to be at L11:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<a
            disabled={{if
              true
              (action \\"mostPowerfulAction\\" value=target.value)
              (action \\"lessPowerfulAction\\" value=target.value)
            }}
          >{{contact-details
             firstName
             lastName
           }}</a>",
            },
          ]
        `);
      },
    },
    {
      config: {
        'process-elements': true,
      },
      template:
        '<a href="https://www.emberjs.com" class="emberjs-home link" rel="noopener" target="_blank">Ember JS</a>',
      fixedTemplate:
        '<a\n  href="https://www.emberjs.com"\n  class="emberjs-home link"\n  rel="noopener"\n  target="_blank"\n>Ember JS</a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 3,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'href' beginning at L1:C3. Expected 'href' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<a href=\\"https://www.emberjs.com\\" class=\\"emberjs-home link\\" rel=\\"noopener\\" target=\\"_blank\\">Ember JS</a>",
            },
            Object {
              "column": 34,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'class' beginning at L1:C34. Expected 'class' to be at L3:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<a href=\\"https://www.emberjs.com\\" class=\\"emberjs-home link\\" rel=\\"noopener\\" target=\\"_blank\\">Ember JS</a>",
            },
            Object {
              "column": 60,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'rel' beginning at L1:C60. Expected 'rel' to be at L4:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<a href=\\"https://www.emberjs.com\\" class=\\"emberjs-home link\\" rel=\\"noopener\\" target=\\"_blank\\">Ember JS</a>",
            },
            Object {
              "column": 75,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of htmlAttribute 'target' beginning at L1:C75. Expected 'target' to be at L5:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<a href=\\"https://www.emberjs.com\\" class=\\"emberjs-home link\\" rel=\\"noopener\\" target=\\"_blank\\">Ember JS</a>",
            },
            Object {
              "column": 90,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of close bracket '>' for the element '<a>' beginning at L1:C90. Expected '<a>' to be at L6:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<a href=\\"https://www.emberjs.com\\" class=\\"emberjs-home link\\" rel=\\"noopener\\" target=\\"_blank\\">Ember JS</a>",
            },
            Object {
              "column": 99,
              "endColumn": 103,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of close tag '</a>' for element '<a>' beginning at L1:C99. Expected '</a>' to be at L1:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<a href=\\"https://www.emberjs.com\\" class=\\"emberjs-home link\\" rel=\\"noopener\\" target=\\"_blank\\">Ember JS</a>",
            },
          ]
        `);
      },
    },
    {
      // Non-Block form more than 30 characters
      config: {
        'open-invocation-max-len': 30,
      },
      template: '{{contact-details firstName=firstName lastName=lastName}}',
      fixedTemplate: '{{contact-details\n  firstName=firstName\n  lastName=lastName\n}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 18,
              "endColumn": 57,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of attribute 'firstName' beginning at L1:C18. Expected 'firstName' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{contact-details firstName=firstName lastName=lastName}}",
            },
            Object {
              "column": 38,
              "endColumn": 57,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of attribute 'lastName' beginning at L1:C38. Expected 'lastName' to be at L3:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{contact-details firstName=firstName lastName=lastName}}",
            },
            Object {
              "column": 55,
              "endColumn": 57,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{contact-details}}' beginning at L1:C55. Expected '{{contact-details}}' to be at L4:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{contact-details firstName=firstName lastName=lastName}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'process-elements': true,
      },
      template: `<a
  disabled
>
{{#each
  class="abc"
}}spam me
{{/each}}</a>`,
      fixedTemplate: `<a
  disabled
>
{{#each
  class="abc"
}}spam me
{{/each}}
</a>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 9,
              "endColumn": 13,
              "endLine": 7,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 7,
              "message": "Incorrect indentation of close tag '</a>' for element '<a>' beginning at L7:C9. Expected '</a>' to be at L8:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<a
            disabled
          >
          {{#each
            class=\\"abc\\"
          }}spam me
          {{/each}}</a>",
            },
          ]
        `);
      },
    },
    {
      // Block form with multiple lines
      template: `{{#contact-details
 firstName=firstName lastName=lastName as |contact|}}
 {{contact.fullName}}
{{/contact-details}}`,
      fixedTemplate: `{{#contact-details
  firstName=firstName
  lastName=lastName
as |contact|
}}
 {{contact.fullName}}
{{/contact-details}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 1,
              "endColumn": 20,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of attribute 'firstName' beginning at L2:C1. Expected 'firstName' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
           firstName=firstName lastName=lastName as |contact|}}
           {{contact.fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 21,
              "endColumn": 20,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of attribute 'lastName' beginning at L2:C21. Expected 'lastName' to be at L3:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
           firstName=firstName lastName=lastName as |contact|}}
           {{contact.fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 38,
              "endColumn": 20,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of block params 'as |contact|}}' beginning at L2:C38. Expecting the block params to be at L3:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
           firstName=firstName lastName=lastName as |contact|}}
           {{contact.fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 51,
              "endColumn": 20,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{contact-details}}' beginning at L2:C51. Expected '{{contact-details}}' to be at L4:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
           firstName=firstName lastName=lastName as |contact|}}
           {{contact.fullName}}
          {{/contact-details}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'open-invocation-max-len': 20,
      },
      template: `{{#contact-details
  firstName=firstName
  lastName=lastName
as |fullName|}}
  {{fullName}}
{{/contact-details}}`,
      fixedTemplate: `{{#contact-details
  firstName=firstName
  lastName=lastName
as |fullName|
}}
  {{fullName}}
{{/contact-details}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 13,
              "endColumn": 20,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 4,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{contact-details}}' beginning at L4:C13. Expected '{{contact-details}}' to be at L5:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
            firstName=firstName
            lastName=lastName
          as |fullName|}}
            {{fullName}}
          {{/contact-details}}",
            },
          ]
        `);
      },
    },
    {
      // Block form (> 80 chars)
      template:
        '{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}\n' +
        '  {{fullName}}\n' +
        '{{/contact-details}}',
      fixedTemplate: `{{#contact-details
  firstName=firstName
  lastName=lastName
  age=age
  avatar=avatar
as |contact|
}}
  {{fullName}}
{{/contact-details}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 19,
              "endColumn": 20,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of attribute 'firstName' beginning at L1:C19. Expected 'firstName' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}
            {{fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 39,
              "endColumn": 20,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of attribute 'lastName' beginning at L1:C39. Expected 'lastName' to be at L3:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}
            {{fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 57,
              "endColumn": 20,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of attribute 'age' beginning at L1:C57. Expected 'age' to be at L4:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}
            {{fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 65,
              "endColumn": 20,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of attribute 'avatar' beginning at L1:C65. Expected 'avatar' to be at L5:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}
            {{fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 78,
              "endColumn": 20,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of block params 'as |contact|}}' beginning at L1:C78. Expecting the block params to be at L2:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}
            {{fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 91,
              "endColumn": 20,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{contact-details}}' beginning at L1:C91. Expected '{{contact-details}}' to be at L3:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details firstName=firstName lastName=lastName age=age avatar=avatar as |contact|}}
            {{fullName}}
          {{/contact-details}}",
            },
          ]
        `);
      },
    },
    {
      // Block form with no params with multiple lines.
      template:
        '{{#contact-details' +
        '\n' +
        '\n' +
        '\n' +
        'as |contact|}}' +
        '\n' +
        '  {{contact.fullName}}' +
        '\n' +
        '{{/contact-details}}',
      fixedTemplate:
        '{{#contact-details' +
        '\n' +
        'as |contact|' +
        '\n' +
        '}}' +
        '\n' +
        '  {{contact.fullName}}' +
        '\n' +
        '{{/contact-details}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 20,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 4,
              "message": "Incorrect indentation of block params 'as |contact|}}' beginning at L4:C0. Expecting the block params to be at L2:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details


          as |contact|}}
            {{contact.fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 12,
              "endColumn": 20,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 4,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{contact-details}}' beginning at L4:C12. Expected '{{contact-details}}' to be at L3:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details


          as |contact|}}
            {{contact.fullName}}
          {{/contact-details}}",
            },
          ]
        `);
      },
    },
    {
      // with helper, non-block, > 80 chars
      config: {
        'open-invocation-max-len': 80,
      },
      template:
        '{{if (or logout.isRunning (not session.isAuthenticated)) "Logging Out..." "Log Out"}}',
      fixedTemplate: `{{if
  (or logout.isRunning (not session.isAuthenticated))
  "Logging Out..."
  "Log Out"
}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 85,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of positional param 'or' beginning at L1:C5. Expected 'or' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{if (or logout.isRunning (not session.isAuthenticated)) \\"Logging Out...\\" \\"Log Out\\"}}",
            },
            Object {
              "column": 57,
              "endColumn": 85,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of positional param 'Logging Out...' beginning at L1:C57. Expected 'Logging Out...' to be at L3:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{if (or logout.isRunning (not session.isAuthenticated)) \\"Logging Out...\\" \\"Log Out\\"}}",
            },
            Object {
              "column": 74,
              "endColumn": 85,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of positional param 'Log Out' beginning at L1:C74. Expected 'Log Out' to be at L4:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{if (or logout.isRunning (not session.isAuthenticated)) \\"Logging Out...\\" \\"Log Out\\"}}",
            },
            Object {
              "column": 83,
              "endColumn": 85,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{if}}' beginning at L1:C83. Expected '{{if}}' to be at L5:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{if (or logout.isRunning (not session.isAuthenticated)) \\"Logging Out...\\" \\"Log Out\\"}}",
            },
          ]
        `);
      },
    },
    {
      template: ['{{foo-bar', 'baz=true', '}}'].join('\n'),
      fixedTemplate: ['{{foo-bar', '  baz=true', '}}'].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 2,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of attribute 'baz' beginning at L2:C0. Expected 'baz' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{foo-bar
          baz=true
          }}",
            },
          ]
        `);
      },
    },
    {
      template: ['{{#foo-bar', 'baz=true', '}}', '{{/foo-bar}}'].join('\n'),
      fixedTemplate: ['{{#foo-bar', '  baz=true', '}}', '{{/foo-bar}}'].join('\n'),

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 12,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of attribute 'baz' beginning at L2:C0. Expected 'baz' to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#foo-bar
          baz=true
          }}
          {{/foo-bar}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'new-line',
        'open-invocation-max-len': 60,
      },
      template: `<div
  class="classy">
{{#contact-details
  param0
  param1=abc
  param2=abc
as |ab cd ef  cd ef |}}
  {{contact.fullName}}
{{/contact-details}}
</div>`,
      fixedTemplate: `<div
  class="classy"
>
{{#contact-details
  param0
  param1=abc
  param2=abc
as |ab cd ef  cd ef |
}}
  {{contact.fullName}}
{{/contact-details}}
</div>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 16,
              "endColumn": 6,
              "endLine": 10,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of close bracket '>' for the element '<div>' beginning at L2:C16. Expected '<div>' to be at L3:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div
            class=\\"classy\\">
          {{#contact-details
            param0
            param1=abc
            param2=abc
          as |ab cd ef  cd ef |}}
            {{contact.fullName}}
          {{/contact-details}}
          </div>",
            },
            Object {
              "column": 21,
              "endColumn": 20,
              "endLine": 9,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 7,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{contact-details}}' beginning at L7:C21. Expected '{{contact-details}}' to be at L8:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
            param0
            param1=abc
            param2=abc
          as |ab cd ef  cd ef |}}
            {{contact.fullName}}
          {{/contact-details}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
        'element-open-end': 'last-attribute',
        'as-indentation': 'attribute',
        'open-invocation-max-len': 60,
      },
      template: `<div
  class="classy"
>
{{#contact-details
  param0
  param1=abc
  param2=abc
as |ab cd ef  cd ef |
}}
  {{contact.fullName}}
{{/contact-details}}
</div>`,
      fixedTemplate: `<div
  class="classy">
{{#contact-details
  param0
  param1=abc
  param2=abc
  as |ab cd ef  cd ef |}}
  {{contact.fullName}}
{{/contact-details}}
</div>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 12,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Incorrect indentation of close bracket '>' for the element '<div>' beginning at L3:C0. Expected '<div>' to be at L2:C16.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div
            class=\\"classy\\"
          >
          {{#contact-details
            param0
            param1=abc
            param2=abc
          as |ab cd ef  cd ef |
          }}
            {{contact.fullName}}
          {{/contact-details}}
          </div>",
            },
            Object {
              "column": 0,
              "endColumn": 20,
              "endLine": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 8,
              "message": "Incorrect indentation of block params 'as |ab cd ef  cd ef |
          }}' beginning at L8:C0. Expecting the block params to be at L8:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
            param0
            param1=abc
            param2=abc
          as |ab cd ef  cd ef |
          }}
            {{contact.fullName}}
          {{/contact-details}}",
            },
            Object {
              "column": 0,
              "endColumn": 20,
              "endLine": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 9,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{contact-details}}' beginning at L9:C0. Expected '{{contact-details}}' to be at L8:C23.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
            param0
            param1=abc
            param2=abc
          as |ab cd ef  cd ef |
          }}
            {{contact.fullName}}
          {{/contact-details}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'mustache-open-end': 'last-attribute',
        'element-open-end': 'new-line',
        'open-invocation-max-len': 15,
      },
      template: `<div
  class="classy">
{{#contact-details
  param0
  param1=abc
  param2=abc
as |ab cd ef  cd ef |
}}
  {{contact.fullName}}
{{/contact-details}}
</div>`,
      fixedTemplate: `<div
  class="classy"
>
{{#contact-details
  param0
  param1=abc
  param2=abc
as |ab cd ef  cd ef |}}
  {{contact.fullName}}
{{/contact-details}}
</div>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 16,
              "endColumn": 6,
              "endLine": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of close bracket '>' for the element '<div>' beginning at L2:C16. Expected '<div>' to be at L3:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div
            class=\\"classy\\">
          {{#contact-details
            param0
            param1=abc
            param2=abc
          as |ab cd ef  cd ef |
          }}
            {{contact.fullName}}
          {{/contact-details}}
          </div>",
            },
            Object {
              "column": 0,
              "endColumn": 20,
              "endLine": 10,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 8,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{contact-details}}' beginning at L8:C0. Expected '{{contact-details}}' to be at L7:C21.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
            param0
            param1=abc
            param2=abc
          as |ab cd ef  cd ef |
          }}
            {{contact.fullName}}
          {{/contact-details}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'mustache-open-end': 'new-line',
        'element-open-end': 'last-attribute',
        'open-invocation-max-len': 25,
      },
      template: `<div
  class="classy-quite-long"
>
{{#contact-details
  param0
  param1=abc
  param2=abc
as |ab cd ef  cd ef |}}
  {{contact.fullName}}
{{/contact-details}}
</div>`,
      fixedTemplate: `<div
  class="classy-quite-long">
{{#contact-details
  param0
  param1=abc
  param2=abc
as |ab cd ef  cd ef |
}}
  {{contact.fullName}}
{{/contact-details}}
</div>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 11,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Incorrect indentation of close bracket '>' for the element '<div>' beginning at L3:C0. Expected '<div>' to be at L2:C27.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div
            class=\\"classy-quite-long\\"
          >
          {{#contact-details
            param0
            param1=abc
            param2=abc
          as |ab cd ef  cd ef |}}
            {{contact.fullName}}
          {{/contact-details}}
          </div>",
            },
            Object {
              "column": 21,
              "endColumn": 20,
              "endLine": 10,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 8,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{contact-details}}' beginning at L8:C21. Expected '{{contact-details}}' to be at L9:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#contact-details
            param0
            param1=abc
            param2=abc
          as |ab cd ef  cd ef |}}
            {{contact.fullName}}
          {{/contact-details}}",
            },
          ]
        `);
      },
    },
    {
      template: `
      <form
        {{action 'authenticate' email password}}
        class='form-signin'
      >
      </form>`,
      fixedTemplate: `
      <form
        class='form-signin'
        {{action 'authenticate' email password}}
      >
      </form>`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 8,
              "endColumn": 13,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 4,
              "message": "Incorrect indentation of htmlAttribute 'class' beginning at L4:C8. Expected 'class' to be at L3:C8.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<form
                  {{action 'authenticate' email password}}
                  class='form-signin'
                >
                </form>",
            },
            Object {
              "column": 8,
              "endColumn": 13,
              "endLine": 6,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Incorrect indentation of element modifier 'action' beginning at L3:C8. Expected 'action' to be at L4:C8.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<form
                  {{action 'authenticate' email password}}
                  class='form-signin'
                >
                </form>",
            },
          ]
        `);
      },
    },
    {
      template: `{{#foo bar as |foo|}}
    {{foo.bar
      baz}}{{/foo}}`,
      fixedTemplate: `{{#foo bar as |foo|}}
    {{foo.bar
      baz
    }}{{/foo}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 9,
              "endColumn": 11,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{foo.bar}}' beginning at L3:C9. Expected '{{foo.bar}}' to be at L4:C4.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{foo.bar
                baz}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'as-indentation': 'attribute',
        'open-invocation-max-len': 20,
      },
      template: `{{#super-component as |myYieldProperty|}}
{{/super-component}}`,
      fixedTemplate: `{{#super-component
  as |myYieldProperty|
}}
{{/super-component}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 18,
              "endColumn": 20,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of block params 'as |myYieldProperty|}}' beginning at L1:C18. Expecting the block params to be at L2:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#super-component as |myYieldProperty|}}
          {{/super-component}}",
            },
            Object {
              "column": 39,
              "endColumn": 20,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{super-component}}' beginning at L1:C39. Expected '{{super-component}}' to be at L3:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#super-component as |myYieldProperty|}}
          {{/super-component}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'as-indentation': 'attribute',
        'open-invocation-max-len': 20,
      },
      template: `{{#super-component
  id='truc'
as |myYieldProperty
  anotherOne|}}
{{/super-component}}`,
      fixedTemplate: `{{#super-component
  id='truc'
  as |myYieldProperty
  anotherOne|
}}
{{/super-component}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 20,
              "endLine": 5,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Incorrect indentation of block params 'as |myYieldProperty
            anotherOne|}}' beginning at L3:C0. Expecting the block params to be at L3:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#super-component
            id='truc'
          as |myYieldProperty
            anotherOne|}}
          {{/super-component}}",
            },
            Object {
              "column": 13,
              "endColumn": 20,
              "endLine": 5,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 4,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{super-component}}' beginning at L4:C13. Expected '{{super-component}}' to be at L5:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#super-component
            id='truc'
          as |myYieldProperty
            anotherOne|}}
          {{/super-component}}",
            },
          ]
        `);
      },
    },
    {
      config: {
        'as-indentation': 'attribute',
        'open-invocation-max-len': 20,
      },
      template: `{{#super-component
  id='truc' as |myYieldProperty
  anotherOne|}}
{{/super-component}}`,
      fixedTemplate: `{{#super-component
  id='truc'
  as |myYieldProperty
  anotherOne|
}}
{{/super-component}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 11,
              "endColumn": 20,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of block params 'as |myYieldProperty
            anotherOne|}}' beginning at L2:C11. Expecting the block params to be at L3:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#super-component
            id='truc' as |myYieldProperty
            anotherOne|}}
          {{/super-component}}",
            },
            Object {
              "column": 13,
              "endColumn": 20,
              "endLine": 4,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 3,
              "message": "Incorrect indentation of close curly braces '}}' for the component '{{super-component}}' beginning at L3:C13. Expected '{{super-component}}' to be at L5:C0.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "{{#super-component
            id='truc' as |myYieldProperty
            anotherOne|}}
          {{/super-component}}",
            },
          ]
        `);
      },
    },
    {
      template: `{{#if (and this.isNotForestProduction this.forestEnvironmentIndicatorOpened)}}
  <div {{on 'click' this.hideForestEnvironmentIndicator}}
    class="c-indicator-forest-environment c-indicator-forest-environment--{{this.environment}}"
    role="button"
>
<span class="test-me">mine</span>
</div>
    {{/if}}`,
      fixedTemplate: `{{#if (and this.isNotForestProduction this.forestEnvironmentIndicatorOpened)}}
  <div
    class="c-indicator-forest-environment c-indicator-forest-environment--{{this.environment}}"
    role="button"
    {{on 'click' this.hideForestEnvironmentIndicator}}
  >
<span class="test-me">mine</span>
  </div>
    {{/if}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 7,
              "endColumn": 6,
              "endLine": 7,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "Incorrect indentation of element modifier 'on' beginning at L2:C7. Expected 'on' to be at L5:C4.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div {{on 'click' this.hideForestEnvironmentIndicator}}
              class=\\"c-indicator-forest-environment c-indicator-forest-environment--{{this.environment}}\\"
              role=\\"button\\"
          >
          <span class=\\"test-me\\">mine</span>
          </div>",
            },
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 7,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 5,
              "message": "Incorrect indentation of close bracket '>' for the element '<div>' beginning at L5:C0. Expected '<div>' to be at L6:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div {{on 'click' this.hideForestEnvironmentIndicator}}
              class=\\"c-indicator-forest-environment c-indicator-forest-environment--{{this.environment}}\\"
              role=\\"button\\"
          >
          <span class=\\"test-me\\">mine</span>
          </div>",
            },
            Object {
              "column": 0,
              "endColumn": 6,
              "endLine": 7,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 7,
              "message": "Incorrect indentation of close tag '</div>' for element '<div>' beginning at L7:C0. Expected '</div>' to be at L7:C2.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<div {{on 'click' this.hideForestEnvironmentIndicator}}
              class=\\"c-indicator-forest-environment c-indicator-forest-environment--{{this.environment}}\\"
              role=\\"button\\"
          >
          <span class=\\"test-me\\">mine</span>
          </div>",
            },
          ]
        `);
      },
    },
    {
      template: `{{#if this.toastr.listToDisplay}}
  <Toastr::ToastrContainer>
    {{#each this.toastr.listToDisplay key='id' as |toast|}}
      <Toastr::ToastrItem
        @id={{toast.id}}
        @type={{toast.content.type}}
        @message={{toast.content.message}}
        @duration={{toast.content.duration}}
        @removeToast={{this.removeToast}}
    />
    {{/each}}
  </Toastr::ToastrContainer>
{{/if}}`,
      fixedTemplate: `{{#if this.toastr.listToDisplay}}
  <Toastr::ToastrContainer>
    {{#each this.toastr.listToDisplay key='id' as |toast|}}
      <Toastr::ToastrItem
        @id={{toast.id}}
        @type={{toast.content.type}}
        @message={{toast.content.message}}
        @duration={{toast.content.duration}}
        @removeToast={{this.removeToast}}
      />
    {{/each}}
  </Toastr::ToastrContainer>
{{/if}}`,
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 4,
              "endColumn": 6,
              "endLine": 10,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 10,
              "message": "Incorrect indentation of close bracket '>' for the element '<Toastr::ToastrItem>' beginning at L10:C4. Expected '<Toastr::ToastrItem>' to be at L10:C6.",
              "rule": "attribute-indentation",
              "severity": 2,
              "source": "<Toastr::ToastrItem
                  @id={{toast.id}}
                  @type={{toast.content.type}}
                  @message={{toast.content.message}}
                  @duration={{toast.content.duration}}
                  @removeToast={{this.removeToast}}
              />",
            },
          ]
        `);
      },
    },
  ],
});

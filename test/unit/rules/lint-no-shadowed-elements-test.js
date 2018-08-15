'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-shadowed-elements',

  config: true,

  good: [
    '{{#foo-bar as |Baz|}}<Baz />{{/foo-bar}}',
    '<FooBar as |Baz|><Baz /></FooBar>',
    '{{#with foo=(component "blah-zorz") as |Div|}}<Div></Div>{{/with}}',
    '<Foo as |bar|><bar.baz /></Foo>',
  ],

  bad: [
    {
      template: '<FooBar as |div|><div></div></FooBar>',

      result: {
        moduleId: 'layout.hbs',
        message: 'Ambiguous element used (`div`)',
        line: 1,
        column: 17,
        source: '<div></div>'
      }
    },
  ],
});

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-index-component-invocation',

  config: 'true',
  good: [
    '<Foo::Bar />',
    '<Foo::IndexItem />',
    '<Foo::MyIndex />',
    '{{foo/index-item}}',
    '{{foo/my-index}}',
    '{{foo/bar}}',
    '{{component "foo/bar"}}',
    '{{component "foo/my-index"}}',
    '{{component "foo/index-item"}}',
  ],
  bad: [
    {
      template: '{{foo/index}}',
      result: {
        message: 'Replace `{{foo/index ...` to `{{foo ...`',
        source: 'foo/index',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{foo/bar (component "foo/index")}}',
      result: {
        message: 'Replace `(component "foo/index" ...` to `(component "foo" ...`',
        source: '"foo/index"',
        line: 1,
        column: 21,
      },
    },
    {
      template: '{{foo/bar name=(component "foo/index")}}',
      result: {
        message: 'Replace `(component "foo/index" ...` to `(component "foo" ...`',
        source: '"foo/index"',
        line: 1,
        column: 26,
      },
    },
    {
      template: '<Foo::Index />',
      result: {
        message: 'Replace `<Foo::Index ...` to `<Foo ...`',
        source: '<Foo::Index />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<Foo::Bar::Index />',
      result: {
        message: 'Replace `<Foo::Bar::Index ...` to `<Foo::Bar ...`',
        source: '<Foo::Bar::Index />',
        line: 1,
        column: 0,
      },
    },
    {
      template: '<Foo::Index></Foo::Index>',
      result: {
        message: 'Replace `<Foo::Index ...` to `<Foo ...`',
        source: '<Foo::Index></Foo::Index>',
        line: 1,
        column: 0,
      },
    },
  ],
});

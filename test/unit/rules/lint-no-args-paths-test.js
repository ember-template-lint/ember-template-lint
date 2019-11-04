'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-args-paths',

  config: 'true',
  good: [
    '<div @foo={{cleanup this.args}}></div>',
    '{{foo (name this.args)}}',
    '{{foo name=this.args}}',
    '{{foo name=(extract this.args)}}',
    '<Foo @params={{this.args}} />',
    '<Foo {{mod this.args}} />',
    '<Foo {{mod items=this.args}} />',
    '<Foo {{mod items=(extract this.args)}} />',
  ],
  bad: [
    {
      template: '{{hello (format value=args.foo)}}',
      result: {
        message: 'Component templates should avoid "args.foo" usage, try "@foo" instead.',
        source: 'args.foo',
        line: 1,
        column: 22,
      },
    },
    {
      template: '{{hello value=args.foo}}',
      result: {
        message: 'Component templates should avoid "args.foo" usage, try "@foo" instead.',
        source: 'args.foo',
        line: 1,
        column: 14,
      },
    },
    {
      template: '{{hello (format args.foo.bar)}}',
      result: {
        message: 'Component templates should avoid "args.foo.bar" usage, try "@foo.bar" instead.',
        source: 'args.foo.bar',
        line: 1,
        column: 16,
      },
    },
    {
      template: '<br {{hello args.foo.bar}}>',
      result: {
        message: 'Component templates should avoid "args.foo.bar" usage, try "@foo.bar" instead.',
        source: 'args.foo.bar',
        line: 1,
        column: 12,
      },
    },
    {
      template: '{{hello args.foo.bar}}',
      result: {
        message: 'Component templates should avoid "args.foo.bar" usage, try "@foo.bar" instead.',
        source: 'args.foo.bar',
        line: 1,
        column: 8,
      },
    },
    {
      template: '{{args.foo.bar}}',
      result: {
        message: 'Component templates should avoid "args.foo.bar" usage, try "@foo.bar" instead.',
        source: 'args.foo.bar',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{args.foo}}',
      result: {
        message: 'Component templates should avoid "args.foo" usage, try "@foo" instead.',
        source: 'args.foo',
        line: 1,
        column: 2,
      },
    },
    {
      template: '{{this.args.foo}}',
      result: {
        message: 'Component templates should avoid "this.args.foo" usage, try "@foo" instead.',
        source: 'this.args.foo',
        line: 1,
        column: 2,
      },
    },
  ],
});

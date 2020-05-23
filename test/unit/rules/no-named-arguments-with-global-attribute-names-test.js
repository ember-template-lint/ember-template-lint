'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const { makeError } = require('../../../lib/rules/no-named-arguments-with-global-attribute-names');

const good = [
  '{{my-component class="shaded"}}',
  '{{#my-component class="shaded"}}welcome{{/my-component}}',
  '<MyComponent class="shaded" />',
  '<MyComponent class="shaded">bienvenidos</MyComponent>',
  '<MyComponent aria-valuemin={{0}} />',
  '<MyComponent data-id="123" />',
  '<MyComponent onclick={{action "myAction"}} />',
  '<MyComponent {{on "click" this.myAction}} />',
  '{{log "foo" class="bar"}}',
];

const bad = [
  {
    template: '<MyComponent @class="shaded" />',
    result: {
      message: makeError('@class'),
      source: '<MyComponent @class="shaded" />',
      line: 1,
      column: 0,
    },
  },
  {
    template: '<MyComponent @aria-valuemin={{1}} />',
    result: {
      message: makeError('@aria-valuemin'),
      source: '<MyComponent @aria-valuemin={{1}} />',
      line: 1,
      column: 0,
    },
  },
  {
    template: '<MyComponent @data-id="123" />',
    result: {
      message: makeError('@data-id'),
      source: '<MyComponent @data-id="123" />',
      line: 1,
      column: 0,
    },
  },
  {
    template: '<MyComponent @onclick={{action "myAction"}} />',
    result: {
      message: makeError('@onclick'),
      source: '<MyComponent @onclick={{action "myAction"}} />',
      line: 1,
      column: 0,
    },
  },
];

generateRuleTests({
  name: 'no-named-arguments-with-global-attribute-names',
  config: true,
  good,
  bad,
});

generateRuleTests({
  name: 'no-named-arguments-with-global-attribute-names',
  config: {
    allow: ['class'],
  },
  good,
  bad: bad.filter((testCase) => !testCase.template.includes('@class')),
});

generateRuleTests({
  name: 'no-named-arguments-with-global-attribute-names',
  config: {
    disallow: ['itemid'],
  },
  good: good.concat(['<MyComponent itemid="456" />']),
  bad: bad.concat([
    {
      template: '<MyComponent @itemid="456" />',
      result: {
        message: makeError('@itemid'),
        source: '<MyComponent @itemid="456" />',
        line: 1,
        column: 0,
      },
    },
  ]),
});

generateRuleTests({
  name: 'no-named-arguments-with-global-attribute-names',
  config: {
    allow: ['itemid'],
    disallow: ['itemid'],
  },
  good: good.concat(['<MyComponent itemid="456" />', '<MyComponent @itemid="456" />']),
  bad,
});

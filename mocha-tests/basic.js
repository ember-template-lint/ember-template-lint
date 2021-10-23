const generateRuleTests = require('../lib/helpers/rule-test-harness');
const Rule = require('../lib/rules/_base');

generateRuleTests({
  name: 'rule-with-async-visitor-hook',
  config: true,

  groupMethodBefore: before,
  groupingMethod: describe,
  testMethod: it,
  plugins: [
    {
      name: 'rule-with-async-visitor-hook',
      rules: {
        'rule-with-async-visitor-hook': class extends Rule {
          async visitor() {
            await new Promise((resolve) => setTimeout(resolve, 10));
            return {
              ElementNode(node) {
                this.log({
                  message: 'Do not use any <promise> HTML elements!',
                  node,
                });
              },
            };
          }
        },
      },
    },
  ],

  good: ['{{haha-wtf}}', '<div></div><div></div>'],

  bad: [
    {
      template: `<div></div>`,
      result: {
        message: 'Do not use any <promise> HTML elements!',
        line: 1,
        column: 0,
        source: '<div></div>',
      },
    },
  ],
});

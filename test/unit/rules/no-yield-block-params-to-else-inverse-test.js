import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-yield-block-params-to-else-inverse',

  config: true,

  good: [
    '{{yield}}',
    '{{yield to="whatever"}}',
    '{{yield to=this.someValue}}',
    '{{yield to=(get some this.map)}}',
    '{{not-yield "some" "param" to="else"}}',
  ],

  bad: [
    {
      template: '{{yield "some" "param" to="else"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 0,
     "endColumn": 34,
     "endLine": 1,
     "filePath": "layout.hbs",
     "line": 1,
     "message": "Yielding block params to else/inverse block is not allowed",
     "rule": "no-yield-block-params-to-else-inverse",
     "severity": 2,
     "source": "{{yield "some" "param" to="else"}}",
   },
 ]
        `);
      },
    },
    {
      template: '{{yield "some" "param" to="inverse"}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
 [
   {
     "column": 0,
     "endColumn": 37,
     "endLine": 1,
     "filePath": "layout.hbs",
     "line": 1,
     "message": "Yielding block params to else/inverse block is not allowed",
     "rule": "no-yield-block-params-to-else-inverse",
     "severity": 2,
     "source": "{{yield "some" "param" to="inverse"}}",
   },
 ]
        `);
      },
    },
  ],
});

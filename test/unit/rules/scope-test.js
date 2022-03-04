import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'scope',

  config: true,

  good: [
    '<th scope="row">Some table heading></th>',
    `
<table>
<th scope="col">Table header</th>
<td>Some data</td>
</table>
`,
    '<CustomComponent scope />',
    '<CustomComponent scope={{foo}} />',
  ],
  bad: [
    {
      template: '<td scope="row"></td>',
      result: {
        message: 'The scope attribute should only be set on <th> elements',
        line: 1,
        column: 0,
        source: '<td scope="row"></td>',
      },
    },
    {
      template: '<a scope="row" />',
      result: {
        message: 'The scope attribute should only be set on <th> elements',
        line: 1,
        column: 0,
        source: '<a scope="row" />',
      },
    },
    {
      template: `
<table>
<th>Some header</th>
<td scope="col">Some data</td>
</table>
`,
      result: {
        message: 'The scope attribute should only be set on <th> elements',
        line: 4,
        column: 0,
        source: '<td scope="col">Some data</td>',
      },
    },
  ],
});

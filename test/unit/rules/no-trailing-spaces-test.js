import generateRuleTests from '../../helpers/rule-test-harness.js';

generateRuleTests({
  name: 'no-trailing-spaces',

  config: true,

  good: [
    'test',
    '   test',
    'test\n',
    'test\n' + '\n',
    // test the re-entering of yielded content
    '{{#my-component}}\n' + '  test\n' + '{{/my-component}}',
    {
      template: `import { hbs } from 'ember-cli-htmlbars';

test('it renders', async (assert) => {
  await render(hbs\`
    <div class="parent">
      <div class="child"></div>
    </div>
  \`);
);`,
      meta: {
        filePath: 'layout.js',
      },
    },
  ],

  bad: [
    {
      template: 'test ',
      fixedTemplate: 'test',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 4,
              "endColumn": 5,
              "endLine": 1,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": "test ",
            },
          ]
        `);
      },
    },
    {
      template: 'test \n',
      fixedTemplate: 'test\n',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 4,
              "endColumn": 0,
              "endLine": 2,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 1,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": "test ",
            },
          ]
        `);
      },
    },
    {
      template: 'test\n' + ' \n',
      fixedTemplate: 'test\n' + '\n',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 0,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": " ",
            },
          ]
        `);
      },
    },
    // test the re-entering of yielded content
    // only generates one error instead of two
    {
      template: '{{#my-component}}\n' + '  test \n' + '{{/my-component}}',
      fixedTemplate: '{{#my-component}}\n' + '  test\n' + '{{/my-component}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 6,
              "endColumn": 0,
              "endLine": 3,
              "filePath": "layout.hbs",
              "isFixable": true,
              "line": 2,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": "  test ",
            },
          ]
        `);
      },
    },
    {
      template: `import { hbs } from 'ember-cli-htmlbars';

test('it renders', async (assert) => {
  await render(hbs\`  
    <div class="parent">
      <div class="child"></div>
    </div>
  \`);
);`,
      fixedTemplate: `import { hbs } from 'ember-cli-htmlbars';

test('it renders', async (assert) => {
  await render(hbs\`
    <div class="parent">
      <div class="child"></div>
    </div>
  \`);
);`,
      meta: {
        filePath: 'layout.js',
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 19,
              "endColumn": 23,
              "endLine": 5,
              "filePath": "layout.js",
              "isFixable": true,
              "line": 4,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": "  ",
            },
          ]
        `);
      },
    },
    {
      template: `import { hbs } from 'ember-cli-htmlbars';

test('it renders', async (assert) => {
  await render(hbs\`
    <div></div>
  
    <div></div>
  \`);
);`,
      fixedTemplate: `import { hbs } from 'ember-cli-htmlbars';

test('it renders', async (assert) => {
  await render(hbs\`
    <div></div>

    <div></div>
  \`);
);`,
      meta: {
        filePath: 'layout.js',
      },
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          [
            {
              "column": 0,
              "endColumn": 4,
              "endLine": 7,
              "filePath": "layout.js",
              "isFixable": true,
              "line": 6,
              "message": "line cannot end with space",
              "rule": "no-trailing-spaces",
              "severity": 2,
              "source": "  ",
            },
          ]
        `);
      },
    },
  ],
});

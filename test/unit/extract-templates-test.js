import { coordinatesOf, extractTemplates, replaceTemplates, coordinatesOfResult } from '../../lib/extract-templates.js';
import { Preprocessor } from 'content-tag';

const p = new Preprocessor();

function templateFromByteOffsets(source, start, end) {
  return source.slice(start, end + 1);
}


describe('extractTemplates', function () {
  const handlebarsTemplate = '<div></div>';
  const script =
    /* 1 */ 'export const SomeComponent = <template>\n' +
    /* 2 */ '<button></button>\n' +
    /* 3 */ '</template>';

  describe('extractTemplates with relativePath undefined (receiving input from stdin)', function () {
    it('returns the raw template if the content could be a template', function () {
      let result = extractTemplates(handlebarsTemplate, 'foo.hbs');
      expect(templateFromByteOffsets(handlebarsTemplate, 0, 10)).toMatchInlineSnapshot(`"<div></div>"`);
      expect(result).toMatchInlineSnapshot(`
        [
          {
            "column": 0,
            "columnOffset": 0,
            "end": 10,
            "isEmbedded": undefined,
            "isStrictMode": false,
            "line": 1,
            "start": 0,
            "template": "<div></div>",
            "templateMatch": undefined,
          },
        ]
      `);
    });

    it('returns nothing if the content could be parsed as a script', function () {
      expect(extractTemplates(handlebarsTemplate)).toMatchInlineSnapshot(`[]`);
    });

    it('returns the parsed template if the content could be parsed as a script', function () {
      expect(extractTemplates(script)).toMatchInlineSnapshot(`
        [
          {
            "column": 39,
            "columnOffset": 0,
            "end": 58,
            "isEmbedded": true,
            "isStrictMode": true,
            "line": 1,
            "start": 39,
            "template": "
        <button></button>
        ",
            "templateMatch": {
              "contentRange": {
                "end": 58,
                "start": 39,
              },
              "contents": "
        <button></button>
        ",
              "endRange": {
                "end": 69,
                "start": 58,
              },
              "range": {
                "end": 69,
                "start": 29,
              },
              "startRange": {
                "end": 39,
                "start": 29,
              },
              "tagName": "template",
              "type": "expression",
            },
          },
        ]
      `);
    });
  });

  describe('extractTemplates with relativePath', function () {
    it('returns the entire content as the extension is not a script file', function () {
      expect(extractTemplates(handlebarsTemplate, 'layout.hbs')).toMatchInlineSnapshot(`
        [
          {
            "column": 0,
            "columnOffset": 0,
            "end": 10,
            "isEmbedded": undefined,
            "isStrictMode": false,
            "line": 1,
            "start": 0,
            "template": "<div></div>",
            "templateMatch": undefined,
          },
        ]
      `);
    });
    it('returns the entire content as the extension is a script file', function () {
      expect(extractTemplates(script)).toMatchInlineSnapshot(`
        [
          {
            "column": 39,
            "columnOffset": 0,
            "end": 58,
            "isEmbedded": true,
            "isStrictMode": true,
            "line": 1,
            "start": 39,
            "template": "
        <button></button>
        ",
            "templateMatch": {
              "contentRange": {
                "end": 58,
                "start": 39,
              },
              "contents": "
        <button></button>
        ",
              "endRange": {
                "end": 69,
                "start": 58,
              },
              "range": {
                "end": 69,
                "start": 29,
              },
              "startRange": {
                "end": 39,
                "start": 29,
              },
              "tagName": "template",
              "type": "expression",
            },
          },
        ]
      `);
    });
  });
});

describe('extractTemplates with multiple templates', function () {
  const multiTemplateScript = [
    /* 1 */ `import type { TOC } from '@ember/component/template-only'`,
    /* 2 */ ``,
    /* 3 */ `export const A = <template>x</template>;`,
    /* 4 */ `export const B = <template>y</template>;`,
    /* 5 */ ``,
    /* 6 */ `export const C = <template>`,
    /* 7 */ `  {{yield}}`,
    /* 8 */ `</template> satisfies TOC<{ Blocks: { default: [] }}>`,
    /* 9 */ ``,
  ].join('\n');

  it('has correct templateInfos', function () {
    expect(extractTemplates(multiTemplateScript)).toMatchInlineSnapshot(`
      [
        {
          "column": 27,
          "columnOffset": 0,
          "end": 87,
          "isEmbedded": true,
          "isStrictMode": true,
          "line": 3,
          "start": 86,
          "template": "x",
          "templateMatch": {
            "contentRange": {
              "end": 87,
              "start": 86,
            },
            "contents": "x",
            "endRange": {
              "end": 98,
              "start": 87,
            },
            "range": {
              "end": 98,
              "start": 76,
            },
            "startRange": {
              "end": 86,
              "start": 76,
            },
            "tagName": "template",
            "type": "expression",
          },
        },
        {
          "column": 27,
          "columnOffset": 0,
          "end": 128,
          "isEmbedded": true,
          "isStrictMode": true,
          "line": 4,
          "start": 127,
          "template": "y",
          "templateMatch": {
            "contentRange": {
              "end": 128,
              "start": 127,
            },
            "contents": "y",
            "endRange": {
              "end": 139,
              "start": 128,
            },
            "range": {
              "end": 139,
              "start": 117,
            },
            "startRange": {
              "end": 127,
              "start": 117,
            },
            "tagName": "template",
            "type": "expression",
          },
        },
        {
          "column": 27,
          "columnOffset": 0,
          "end": 182,
          "isEmbedded": true,
          "isStrictMode": true,
          "line": 6,
          "start": 169,
          "template": "
        {{yield}}
      ",
          "templateMatch": {
            "contentRange": {
              "end": 182,
              "start": 169,
            },
            "contents": "
        {{yield}}
      ",
            "endRange": {
              "end": 193,
              "start": 182,
            },
            "range": {
              "end": 193,
              "start": 159,
            },
            "startRange": {
              "end": 169,
              "start": 159,
            },
            "tagName": "template",
            "type": "expression",
          },
        },
      ]
    `);
  });
});

describe('coordinatesOf', function () {
  it('makes sense for one line components', function () {
    let js = '<template>{{book}}</template>';

    const parsed = p.parse(js);
    const result = coordinatesOf(js, parsed[0]);
    expect(result.line).toBe(1);
    expect(result.column).toBe(10);
    expect(result.columnOffset).toBe(0);
    expect(result).toMatchInlineSnapshot(`
      {
        "column": 10,
        "columnOffset": 0,
        "end": 18,
        "line": 1,
        "start": 10,
      }
    `);
  });

  it('should contain only valid rule configuration', function () {
    let typescript =
      /* 1 */ `import Component from '@glimmer/component';\n` +
      /* 2 */ '\n' +
      /* 3 */ 'interface Args {}\n' +
      /* 4 */ '\n' +
      /* 5 */ 'export class SomeComponent extends Component<Args> {\n' +
      /* 6 */ '  <template>\n' +
      /* 7 */ '    {{debugger}}\n' +
      /* 8 */ '  </template>\n' +
      /* 9 */ '}\n';

    const parsed = p.parse(typescript);
    const result = coordinatesOf(typescript, parsed[0]);
    expect(result.line).toBe(6);
    // this may look weird, but this 12th character on line 6 is the \n
    expect(result.column).toBe(12);
    expect(result.columnOffset).toBe(2);
    expect(result).toMatchInlineSnapshot(`
      {
        "column": 12,
        "columnOffset": 2,
        "end": 149,
        "line": 6,
        "start": 129,
      }
    `);
  });

  it('has correct templateInfos when in a function', function() {
    const multiTemplateScript = [
      /* 1 */ `export function foo() {`,
      /* 2 */ `  const bar = 2;`,
      /* 3 */ ``,
      /* 4 */ `  return <template>`,
      /* 5 */ `    {{yield}}`,
      /* 6 */ `  </template>`,
      /* 7 */ `}`,
      /* 8 */ ``,
    ].join('\n');
    const parsed = p.parse(multiTemplateScript);

    expect(coordinatesOf(multiTemplateScript, parsed[0])).toMatchInlineSnapshot(`
      {
        "column": 19,
        "columnOffset": 2,
        "end": 78,
        "line": 4,
        "start": 61,
      }
    `);
  });

  it('has correct templateInfos with multiple templates', function () {
    const multiTemplateScript = [
      /* 1 */ `import type { TOC } from '@ember/component/template-only'`,
      /* 2 */ ``,
      /* 3 */ `export const A = <template>x</template>;`,
      /* 4 */ `export const B = <template>y</template>;`,
      /* 5 */ ``,
      /* 6 */ `export const C = <template>`,
      /* 7 */ `  {{yield}}`,
      /* 8 */ `</template> satisfies TOC<{ Blocks: { default: [] }}>`,
      /* 9 */ ``,
    ].join('\n');
    const parsed = p.parse(multiTemplateScript);

    expect(coordinatesOf(multiTemplateScript, parsed[0])).toMatchInlineSnapshot(`
      {
        "column": 27,
        "columnOffset": 0,
        "end": 87,
        "line": 3,
        "start": 86,
      }
    `);
    expect(coordinatesOf(multiTemplateScript, parsed[1])).toMatchInlineSnapshot(`
      {
        "column": 27,
        "columnOffset": 0,
        "end": 128,
        "line": 4,
        "start": 127,
      }
    `);
    expect(coordinatesOf(multiTemplateScript, parsed[2])).toMatchInlineSnapshot(`
      {
        "column": 27,
        "columnOffset": 0,
        "end": 182,
        "line": 6,
        "start": 169,
      }
    `);
  });

  it('should contain only valid rule configuration', function () {
    let typescript =
      /* 1  */ `import type { TOC } from '@ember/component/template-only';\n` +
      /* 2  */ '\n' +
      /* 3  */ 'interface Args {}\n' +
      /* 4  */ '\n' +
      /* 5  */ 'export const myComponent =\n' +
      /* 6  */ '  <template>\n' +
      /* 7  */ '    {{yield}}\n' +
      /* 8  */ '  </template> satisfies TOC<{\n' +
      /* 9  */ '    Blocks: { default: []; };\n' +
      /* 10 */ '  }>\n' +
      /* 11 */ '\n';

    const parsed = p.parse(typescript);
    const result = coordinatesOf(typescript, parsed[0]);
    expect(result.line).toBe(6);
    expect(result.column).toBe(12);
    expect(result.columnOffset).toBe(2);
    expect(result).toMatchInlineSnapshot(`
      {
        "column": 12,
        "columnOffset": 2,
        "end": 135,
        "line": 6,
        "start": 118,
      }
    `);
  });
});

describe('replaceTemplates', () => {
  it('no-ops with no transforms', () => {
    const gjs = [
      "test('it renders', async (assert) => {",
      '  await render(<template>',
      '  <div class="parent">',
      '    <div class="child"></div>',
      '  </div>',
      '  </template>);',
      '});',
    ].join('\n');

    let result = replaceTemplates(gjs, []);

    expect(result).toEqual(gjs);
  });

  it('handles a no-op transform', () => {
    const gjs = [
      "test('it renders', async (assert) => {",
      '  await render(<template>',
      '  <div class="parent">',
      '    <div class="child"></div>',
      '  </div>',
      '  </template>);',
      '});',
    ].join('\n');

    let parsed = p.parse(gjs);
    let first = parsed[0];

    let result = replaceTemplates(gjs, [{ templateInfo: { templateMatch: first }, transformed: first.contents }]);

    expect(result).toEqual(gjs);
  });

  it('applys a transform', () => {
    const gjs = [
      "test('it renders', async (assert) => {",
      '  await render(<template>',
      '  <div class="parent">',
      '    <div class="child"></div>',
      '  </div>',
      '  </template>);',
      '});',
    ].join('\n');

    let parsed = p.parse(gjs);
    let first = parsed[0];

    let result = replaceTemplates(gjs, [{ templateInfo: { templateMatch: first  }, transformed: `new content` }]);

    expect(result).toMatchInlineSnapshot(`
      "test('it renders', async (assert) => {
        await render(<template>new content</template>);
      });"
    `);
  })
});


describe('coordinatesOfResult', () => {
  it('transforms the coordinates', () => {
      let js = '<template>{{book}}</template>';

      // Return value of buildRules + transform
      const lintResult = {
        column: 2,
        endColumn: 6,
        endLine: 1,
        line: 1,
        // not needed: rule, message, filePath, severity, source
      };
      const templateInfos = extractTemplates(js, 'file.gjs');
      const result = coordinatesOfResult(templateInfos[0], lintResult);

      expect(result.line).toBe(1);
      expect(result.endLine).toBe(1);
      expect(result.column).toBe(12);
  });
});

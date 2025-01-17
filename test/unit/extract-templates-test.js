import { coordinatesOf, extractTemplates, replaceTemplates } from '../../lib/extract-templates.js';
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
            "isStrictMode": true,
            "line": 0,
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
            "column": 29,
            "columnOffset": 0,
            "end": 69,
            "isEmbedded": true,
            "isStrictMode": true,
            "line": 1,
            "start": 29,
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
            "isStrictMode": true,
            "line": 0,
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
            "column": 29,
            "columnOffset": 0,
            "end": 69,
            "isEmbedded": true,
            "isStrictMode": true,
            "line": 1,
            "start": 29,
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
          "column": 17,
          "columnOffset": 0,
          "end": 98,
          "isEmbedded": true,
          "isStrictMode": true,
          "line": 3,
          "start": 76,
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
          "column": 17,
          "columnOffset": 0,
          "end": 139,
          "isEmbedded": true,
          "isStrictMode": true,
          "line": 4,
          "start": 117,
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
          "column": 17,
          "columnOffset": 0,
          "end": 193,
          "isEmbedded": true,
          "isStrictMode": true,
          "line": 6,
          "start": 159,
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
    expect(result.column).toBe(2);
    expect(result.columnOffset).toBe(2);
    expect(result).toMatchInlineSnapshot(`
      {
        "column": 2,
        "columnOffset": 2,
        "end": 160,
        "line": 6,
        "start": 119,
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
        "column": 9,
        "columnOffset": 2,
        "end": 89,
        "line": 4,
        "start": 51,
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
        "column": 17,
        "columnOffset": 0,
        "end": 98,
        "line": 3,
        "start": 76,
      }
    `);
    expect(coordinatesOf(multiTemplateScript, parsed[1])).toMatchInlineSnapshot(`
      {
        "column": 17,
        "columnOffset": 0,
        "end": 139,
        "line": 4,
        "start": 117,
      }
    `);
    expect(coordinatesOf(multiTemplateScript, parsed[2])).toMatchInlineSnapshot(`
      {
        "column": 17,
        "columnOffset": 0,
        "end": 193,
        "line": 6,
        "start": 159,
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
    expect(result.column).toBe(2);
    expect(result.columnOffset).toBe(2);
    expect(result).toMatchInlineSnapshot(`
      {
        "column": 2,
        "columnOffset": 2,
        "end": 146,
        "line": 6,
        "start": 108,
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

import { coordinatesOf, extractTemplates } from '../../lib/extract-templates.js';
import { Preprocessor } from 'content-tag';

const p = new Preprocessor();

describe('extractTemplates', function () {
  const handlebarsTemplate = '<div></div>';
  const script =
    /* 1 */ 'export const SomeComponent = <template>\n' +
    /* 2 */ '<button></button>\n' +
    /* 3 */ '</template>';

  describe('extractTemplates with relativePath undefined (receiving input from stdin)', function () {
    it('returns the raw template if the content could be a template', function () {
      expect(extractTemplates(handlebarsTemplate, 'foo.hbs')).toMatchInlineSnapshot(`
        [
          {
            "column": 0,
            "columnOffset": 0,
            "end": 0,
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
            "end": 0,
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

describe('calculate template coordinates', function () {
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
  });
});

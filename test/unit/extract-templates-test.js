import * as util from 'ember-template-imports/src/util.js';

import { coordinatesOf, extractTemplates } from '../../lib/extract-templates.js';

describe('extractTemplates', function () {
  const handlebarsTemplate = '<div></div>';
  const script =
    'export const SomeComponent = <template>\n' + '<button></button>\n' + '</template>';

  describe('extractTemplates with relativePath undefined (receiving input from stdin)', function () {
    it('returns the entire content if the content could be parsed as a script', function () {
      expect(extractTemplates(handlebarsTemplate)).toMatchInlineSnapshot(`
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
            "start": 29,
            "template": "
        <button></button>
        ",
            "templateMatch": {
              "contents": "
        <button></button>
        ",
              "end": [
                "</template>",
                undefined,
              ],
              "start": [
                "<template>",
                undefined,
              ],
              "tagName": "template",
              "type": "template-tag",
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
            "column": 39,
            "columnOffset": 0,
            "end": 58,
            "isEmbedded": true,
            "isStrictMode": true,
            "line": 1,
            "start": 29,
            "template": "
        <button></button>
        ",
            "templateMatch": {
              "contents": "
        <button></button>
        ",
              "end": [
                "</template>",
                undefined,
              ],
              "start": [
                "<template>",
                undefined,
              ],
              "tagName": "template",
              "type": "template-tag",
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
      `import Component from '@glimmer/component';\n` +
      '\n' +
      'interface Args {}\n' +
      '\n' +
      'export class SomeComponent extends Component<Args> {\n' +
      '  <template>\n' +
      '    {{debugger}}\n' +
      '  </template>\n' +
      '}\n';
    expect(coordinatesOf(typescript, 228)).toEqual({
      line: 8,
      column: 12,
      columnOffset: 2,
    });
  });
});

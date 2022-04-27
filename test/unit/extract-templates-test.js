import { coordinatesOf, extractTemplates } from '../../lib/extract-templates.js';

describe('extractTemplates', function () {
  const handlebarsTemplate = '<div></div>';
  const script =
    'export const SomeComponent = <template>\n' + '<button></button>\n' + '</template>';

  describe('extractTemplates with relativePath undefined (receiving input from stdin)', function () {
    it('returns the entire content if the content could be parsed as a script', function () {
      expect(extractTemplates(handlebarsTemplate)).toEqual([
        {
          column: 0,
          line: 0,
          isEmbedded: undefined,
          template: handlebarsTemplate,
        },
      ]);
    });
    it('returns the parsed template if the content could be parsed as a script', function () {
      expect(extractTemplates(script)).toEqual([
        {
          column: 39,
          line: 1,
          isEmbedded: true,
          template: '\n<button></button>\n',
        },
      ]);
    });
  });

  describe('extractTemplates with relativePath', function () {
    it('returns the entire content as the extension is not a script file', function () {
      expect(extractTemplates(handlebarsTemplate, 'layout.hbs')).toEqual([
        {
          column: 0,
          line: 0,
          isEmbedded: undefined,
          template: handlebarsTemplate,
        },
      ]);
    });
    it('returns the entire content as the extension is a script file', function () {
      expect(extractTemplates(script)).toEqual([
        {
          column: 39,
          line: 1,
          isEmbedded: true,
          template: '\n<button></button>\n',
        },
      ]);
    });
  });
});

describe('calculate template coordinates', function () {
  it('should contain only valid rule configuration', function () {
    let typescript =
      `import { hbs } from 'ember-cli-htmlbars';\n` +
      `import { setComponentTemplate } from '@ember/component';\n` +
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
    });
  });
});

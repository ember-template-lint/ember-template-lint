import * as util from 'ember-template-imports/src/util.js';

import { coordinatesOf, extractTemplates, isStrictMode } from '../../lib/extract-templates.js';

describe('extractTemplates', function () {
  const handlebarsTemplate = '<div></div>';
  const script =
    'export const SomeComponent = <template>\n' + '<button></button>\n' + '</template>';
  const scriptTemplateLiteral = `import { hbs } from 'ember-cli-htmlbars';
      import { setComponentTemplate } from '@ember/component';
      import templateOnly from '@ember/component/template-only';
      export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());`;
  const scriptTemplateLiteralStrictMode = `import { hbs } from 'ember-template-imports';
      import { setComponentTemplate } from '@ember/component';
      import templateOnly from '@ember/component/template-only';
      export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());`;
  const scriptTemplateLiteralStrictModeAliased = `import { hbs as theHbs } from 'ember-template-imports';
      import { setComponentTemplate } from '@ember/component';
      import templateOnly from '@ember/component/template-only';
      export const SomeComponent = setComponentTemplate(theHbs\`{{book}}\`, templateOnly());`;

  describe('extractTemplates with relativePath undefined (receiving input from stdin)', function () {
    it('returns the entire content if the content could be parsed as a script', function () {
      expect(extractTemplates(handlebarsTemplate)).toEqual([
        {
          column: 0,
          line: 0,
          isEmbedded: undefined,
          isStrictMode: true,
          template: handlebarsTemplate,
        },
      ]);
    });
    it('isStrictMode is false for template literal that do not require strict mode', function () {
      expect(extractTemplates(scriptTemplateLiteral)).toEqual([
        {
          column: 60,
          line: 4,
          isEmbedded: true,
          isStrictMode: false,
          template: '{{book}}',
        },
      ]);
    });
    it('isStrictMode is true for template literal that requires strict mode', function () {
      expect(extractTemplates(scriptTemplateLiteralStrictMode)).toEqual([
        {
          column: 60,
          line: 4,
          isEmbedded: true,
          isStrictMode: true,
          template: '{{book}}',
        },
      ]);
    });
    /* TODO
     * when the import identifier is aliased as in:
     * import { hbs as theHbs } from 'ember-template-imports';
     * parseTemplates returns:
     * { importIdentifier: theHbs, importPath: 'ember-template-imports'
     * as isStrictMode() checks for importIdentifier === 'hbs' this case is interpreted as isStrictMode = false.
     *
     */
    it('isStrictMode is true for template literal that requires strict mode when the template identifier is aliased', function () {
      expect(extractTemplates(scriptTemplateLiteralStrictModeAliased)).toEqual([
        {
          column: 63,
          line: 4,
          isEmbedded: true,
          isStrictMode: true,
          template: '{{book}}',
        },
      ]);
    });
    it('returns the parsed template if the content could be parsed as a script', function () {
      expect(extractTemplates(script)).toEqual([
        {
          column: 39,
          line: 1,
          isEmbedded: true,
          isStrictMode: true,
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
          isStrictMode: true,
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
          isStrictMode: true,
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

describe('isStrictMode', function () {
  it.each([
    {
      importIdentifier: util.TEMPLATE_LITERAL_IDENTIFIER,
      importPath: util.TEMPLATE_LITERAL_MODULE_SPECIFIER,
    },
    { type: 'template-tag' },
  ])('isStrictMode returns true', function (templateInfo) {
    expect(isStrictMode(templateInfo)).toBe(true);
  });
  it.each([
    { importIdentifier: 'hbs', importPath: 'ember-cli-htmlbars' },
    { importIdentifier: 'hbs', importPath: '@ember/template-compilation' },
    { importIdentifier: 'hbs', importPath: '@ember/template-compilation' },
    { importIdentifier: 'default', importPath: 'ember-cli-htmlbars-inline-precompile' },
    { importIdentifier: 'default', importPath: 'htmlbars-inline-precompile' },
    { importIdentifier: 'precompileTemplate', importPath: '@ember/template-compilation' },
    { type: 'template-literal' },
  ])('isStrictMode returns false', function (templateInfo) {
    expect(isStrictMode(templateInfo)).toBe(false);
  });
});

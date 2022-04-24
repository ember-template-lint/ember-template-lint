import { coordinatesOf } from '../../lib/extract-templates.js';

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

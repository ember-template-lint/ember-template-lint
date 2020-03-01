'use strict';

const EditorConfigResolver = require('../../lib/get-editor-config');
const Project = require('../helpers/fake-project');

describe('get-editor-config', function() {
  let project = null;

  beforeEach(function() {
    project = new Project();
    project.chdir();
  });

  afterEach(async function() {
    await project.dispose();
  });

  it('able to read and add info from .editorconfig file if exists', function() {
    let filePath = project.path('app.hbs');

    project.write({
      'app.hbs': '',
      '.editorconfig': `
# EditorConfig helps developers define and maintain consistent
# coding styles between different editors and IDEs
# editorconfig.org

root = true


[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = space
indent_size = 2

[*.js]
indent_style = space
indent_size = 3

[*.hbs]
insert_final_newline = false
indent_style = space
indent_size = 12

[*.css]
indent_style = space
indent_size = 5

[*.html]
indent_style = space
indent_size = 2

[*.{diff,md}]
trim_trailing_whitespace = false
      `,
    });

    expect(new EditorConfigResolver().getEditorConfigData(filePath)).toEqual({
      charset: 'utf-8',
      end_of_line: 'lf',
      indent_size: 12,
      indent_style: 'space',
      insert_final_newline: false,
      tab_width: 12,
      trim_trailing_whitespace: true,
    });
  });

  it('return empty object if no config found', function() {
    let filePath = project.path('app.hbs');

    project.write({
      'app.hbs': '',
    });

    expect(new EditorConfigResolver().getEditorConfigData(filePath)).toEqual({});
  });

  it('able to merge different editor config files', function() {
    let filePath = project.path('app/app.hbs');

    project.write({
      app: {
        'app.hbs': '',
        '.editorconfig': `
[*app.hbs]
insert_final_newline = true
`,
      },
      '.editorconfig': `
[*]
indent_style = space

[*.hbs]
indent_size = 5
`,
    });

    expect(new EditorConfigResolver().getEditorConfigData(filePath)).toEqual({
      indent_size: 5,
      indent_style: 'space',
      insert_final_newline: true,
      tab_width: 5,
    });
  });

  it('able to merge different config sections', function() {
    let filePath = project.path('app.hbs');

    project.write({
      'app.hbs': '',
      '.editorconfig': `
[*]
indent_style = space

[*.hbs]
indent_size = 5

[*app.hbs]
insert_final_newline = true

`,
    });

    expect(new EditorConfigResolver().getEditorConfigData(filePath)).toEqual({
      indent_size: 5,
      indent_style: 'space',
      insert_final_newline: true,
      tab_width: 5,
    });
  });

  it('able to resolve relative paths', function() {
    project.write({
      src: {
        'app.hbs': '',
      },
      '.editorconfig': `
[*]
indent_style = space
`,
    });

    expect(new EditorConfigResolver().getEditorConfigData('src/app.hbs')).toEqual({
      indent_style: 'space',
    });
  });

  it('able to resolve config with custom name', function() {
    let filePath = project.path('app.hbs');

    project.write({
      'app.hbs': '',
      '.newline': `
[*]
indent_style = space

[*.hbs]
indent_size = 5

[*app.hbs]
insert_final_newline = true

`,
    });

    expect(
      new EditorConfigResolver().getEditorConfigData(filePath, { config: '.newline' })
    ).toEqual({
      indent_size: 5,
      indent_style: 'space',
      insert_final_newline: true,
      tab_width: 5,
    });
  });

  it('return default values if no hbs in editor config', function() {
    let filePath = project.path('app.hbs');

    project.write({
      'app.hbs': '',
      '.editorconfig': `
[*]
indent_style = space
indent_size = 5
`,
    });

    expect(new EditorConfigResolver().getEditorConfigData(filePath)).toEqual({
      indent_size: 5,
      indent_style: 'space',
      tab_width: 5,
    });
  });

  it('return empty object if editor config not relevant', function() {
    let filePath = project.path('app.hbs');

    project.write({
      'app.hbs': '',
      '.editorconfig': `
[*.css]
indent_style = space
indent_size = 5
`,
    });

    expect(new EditorConfigResolver().getEditorConfigData(filePath)).toEqual({});
  });

  it('allow specify custom editorconfig for file', function() {
    let filePath = project.path('items/app.hbs');

    project.write({
      'app.hbs': '',
      items: {
        'app.hbs': '',
      },
      '.editorconfig': `
# EditorConfig helps developers define and maintain consistent
# coding styles between different editors and IDEs
# editorconfig.org

root = true


[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = space
indent_size = 2

[*.js]
indent_style = space
indent_size = 3

[*.hbs]
insert_final_newline = false
indent_style = space
indent_size = 12

[items/**.hbs]
indent_style = tabs
insert_final_newline = true
indent_size = 14

[*.css]
indent_style = space
indent_size = 5

[*.html]
indent_style = space
indent_size = 2

[*.{diff,md}]
trim_trailing_whitespace = false
      `,
    });

    expect(new EditorConfigResolver().getEditorConfigData(filePath)).toEqual({
      charset: 'utf-8',
      end_of_line: 'lf',
      indent_size: 14,
      indent_style: 'tabs',
      insert_final_newline: true,
      tab_width: 14,
      trim_trailing_whitespace: true,
    });
  });
});

'use strict';

const path = require('path');

const FixturifyProject = require('fixturify-project');

const ROOT = process.cwd();

// this is the default .editorconfig file for new ember-cli apps, taken from:
// https://github.com/ember-cli/ember-new-output/blob/stable/.editorconfig
const DEFAULT_EDITOR_CONFIG = `
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

[*.hbs]
insert_final_newline = false

[*.{diff,md}]
trim_trailing_whitespace = false
`;

// this is the default .template-lintrc.js used by ember-cli apps, taken from:
// https://github.com/ember-cli/ember-new-output/blob/stable/.template-lintrc.js
const DEFAULT_TEMPLATE_LINTRC = `
'use strict';

module.exports = {
  extends: 'octane'
};
`;

module.exports = class FakeProject extends FixturifyProject {
  static defaultSetup() {
    let project = new this();

    project.files['.template-lintrc.js'] = DEFAULT_TEMPLATE_LINTRC;
    project.files['.editorconfig'] = DEFAULT_EDITOR_CONFIG;

    project.writeSync();

    return project;
  }

  constructor(name = 'fake-project', ...args) {
    super(name, ...args);
  }

  setConfig(config) {
    let configFileContents =
      config === undefined
        ? DEFAULT_TEMPLATE_LINTRC
        : `module.exports = ${JSON.stringify(config, null, 2)};`;

    this.files['.template-lintrc.js'] = configFileContents;

    this.writeSync();
  }

  setEditorConfig(value = DEFAULT_EDITOR_CONFIG) {
    this.files['.editorconfig'] = value;

    this.writeSync();
  }

  path(subPath) {
    return subPath ? path.join(this.baseDir, subPath) : this.baseDir;
  }

  // behave like a TempDir from broccoli-test-helper
  write(dirJSON) {
    Object.assign(this.files, dirJSON);
    this.writeSync();
  }

  chdir() {
    this._dirChanged = true;

    // ensure the directory structure is created initially
    this.writeSync();

    process.chdir(this.baseDir);
  }

  dispose() {
    if (this._dirChanged) {
      process.chdir(ROOT);
    }

    return super.dispose();
  }
};

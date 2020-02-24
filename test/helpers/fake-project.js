'use strict';

const path = require('path');
const FixturifyProject = require('fixturify-project');

const ROOT = process.cwd();

module.exports = class FakeProject extends FixturifyProject {
  constructor(name = 'fake-project', ...args) {
    super(name, ...args);
  }

  setConfig(config) {
    this.files['.template-lintrc.js'] = `module.exports = ${JSON.stringify(config, null, 2)};`;

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

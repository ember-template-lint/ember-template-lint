'use strict';

const { _expandFileGlobs: expandFileGlobs } = require('../../../bin/ember-template-lint');
const Project = require('../../helpers/fake-project');

describe('expandFileGlobs', function () {
  let project = null;

  beforeEach(function () {
    project = Project.defaultSetup();
    project.chdir();

    project.write({ 'application.hbs': 'almost empty' });
  });
  afterEach(async function () {
    await project.dispose();
  });

  describe('basic', function () {
    it('resolves a basic pattern', function () {
      let files = expandFileGlobs(['application.hbs', 'other.hbs'], []);
      expect(files.has('application.hbs')).toBe(true);
    });

    it('respects a basic ignore option', function () {
      let files = expandFileGlobs(['application.hbs', 'other.hbs'], ['application.hbs']);
      expect(files.has('application.hbs')).toBe(false);
    });
  });

  describe('glob', function () {
    it('resolves a glob pattern', function () {
      let files = expandFileGlobs(['*'], []);
      expect(files.has('application.hbs')).toBe(true);
    });

    it('respects a glob ignore option', function () {
      let files = expandFileGlobs(['application.hbs'], ['*']);
      expect(files.has('application.hbs')).toBe(false);
    });
  });
});

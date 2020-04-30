'use strict';

const { _expandFileGlobs: expandFileGlobs } = require('../../../bin/ember-template-lint');
const Project = require('../../helpers/fake-project');

describe('expandFileGlobs', function () {
  let project = null;

  beforeEach(function () {
    project = Project.defaultSetup();
  });

  afterEach(async function () {
    await project.dispose();
  });

  describe('basic', function () {
    beforeEach(function () {
      project.chdir();
    });

    it('resolves a basic pattern', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(['application.hbs', 'other.hbs'], []);
      expect(files.has('application.hbs')).toBe(true);
      expect(files.has('other.hbs')).toBe(true);
    });

    it('respects a basic ignore option', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(['application.hbs', 'other.hbs'], ['application.hbs']);
      expect(files.has('application.hbs')).toBe(false);
    });
  });

  describe('glob', function () {
    beforeEach(function () {
      project.chdir();
    });

    it('resolves a glob pattern', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(['*'], []);
      expect(files.has('application.hbs')).toBe(true);
    });

    it('respects a glob ignore option', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(['application.hbs'], ['*']);
      expect(files.has('application.hbs')).toBe(false);
    });
  });
});

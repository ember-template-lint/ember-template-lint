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
    it('resolves a basic pattern (different working directory)', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(project.baseDir, ['application.hbs', 'other.hbs'], []);
      expect(files).toEqual(new Set(['application.hbs']));
    });

    it('respects a basic ignore option (different working directory)', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(
        project.baseDir,
        ['application.hbs', 'other.hbs'],
        ['application.hbs']
      );
      expect(files).toEqual(new Set([]));
    });

    it('resolves a basic pattern (within working directory)', function () {
      project.chdir();
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(project.baseDir, ['application.hbs', 'other.hbs'], []);
      expect(files).toEqual(new Set(['application.hbs']));
    });

    it('resolves arbitrary file extensions', function () {
      project.write({ 'application.foobarbaz': 'almost empty' });

      let ignorePatterns = [];
      function glob() {
        throw new Error('Should not use globbing for exact file matches');
      }

      let files = expandFileGlobs(['application.foobarbaz'], ignorePatterns, glob);
      expect(files).toEqual(new Set(['application.foobarbaz']));
    });

    it('respects a basic ignore option', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(
        project.baseDir,
        ['application.hbs', 'other.hbs'],
        ['application.hbs']
      );
      expect(files).toEqual(new Set([]));
    });
  });

  describe('glob', function () {
    beforeEach(function () {
      project.chdir();
    });

    it('resolves a glob pattern', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(project.baseDir, ['*'], []);
      expect(files.has('application.hbs')).toBe(true);
    });

    it('does not fallback to globbing if not passed a globlike string', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let ignorePatterns = [];
      function glob() {
        throw new Error('Should not use globbing for exact file matches');
      }

      let files = expandFileGlobs(project.baseDir, ['application.hbs'], ignorePatterns, glob);
      expect(files).toEqual(new Set(['application.hbs']));
    });

    it('respects a glob ignore option', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(project.baseDir, ['application.hbs'], ['*']);
      expect(files.has('application.hbs')).toBe(false);
    });
  });
});

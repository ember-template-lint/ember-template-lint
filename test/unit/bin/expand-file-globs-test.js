import { expandFileGlobs } from '../../../lib/helpers/cli.js';
import Project from '../../helpers/fake-project.js';

describe('expandFileGlobs', function () {
  let project = null;

  beforeEach(async function () {
    project = await Project.defaultSetup();
  });

  afterEach(function () {
    project.dispose();
  });

  describe('basic', function () {
    it('resolves a basic pattern (different working directory)', function () {
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(project.baseDir, ['application.hbs'], []);
      expect(files).toEqual(new Set(['application.hbs']));
    });

    it('resolves arbitrary file extensions (different working directory)', function () {
      project.chdir();
      project.write({ 'application.foobarbaz': 'almost empty' });

      let ignorePatterns = [];
      function glob() {
        throw new Error('Should not use globbing for exact file matches');
      }

      let files = expandFileGlobs(project.baseDir, ['application.foobarbaz'], ignorePatterns, glob);
      expect(files).toEqual(new Set(['application.foobarbaz']));
    });

    it('respects a basic ignore option (different working directory)', function () {
      project.write({ 'application.hbs': 'almost empty', 'other.hbs': 'other' });

      let files = expandFileGlobs(
        project.baseDir,
        ['application.hbs', 'other.hbs'],
        ['application.hbs']
      );
      expect(files).toEqual(new Set(['other.hbs']));
    });

    it('resolves a basic pattern (within working directory)', function () {
      project.chdir();
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(project.baseDir, ['application.hbs'], []);
      expect(files).toEqual(new Set(['application.hbs']));
    });

    it('resolves arbitrary file extensions (within working directory)', function () {
      project.chdir();
      project.write({ 'application.foobarbaz': 'almost empty' });

      let ignorePatterns = [];
      function glob() {
        throw new Error('Should not use globbing for exact file matches');
      }

      let files = expandFileGlobs(project.baseDir, ['application.foobarbaz'], ignorePatterns, glob);
      expect(files).toEqual(new Set(['application.foobarbaz']));
    });

    it('respects a basic ignore option (within working directory)', function () {
      project.chdir();
      project.write({ 'application.hbs': 'almost empty' });

      let files = expandFileGlobs(project.baseDir, ['application.hbs'], ['application.hbs']);
      expect(files).toEqual(new Set([]));
    });

    it('throws when provided non-existent file', function () {
      project.chdir();
      project.write({ 'application.hbs': 'almost empty' });

      expect(() =>
        expandFileGlobs(project.baseDir, ['other.hbs'], [])
      ).toThrowErrorMatchingInlineSnapshot(
        `"No files matching the pattern were found: \\"other.hbs\\""`
      );
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

    it('throws when no matches found because of ignore option', function () {
      project.write({ 'application.hbs': 'almost empty' });

      expect(() =>
        expandFileGlobs(project.baseDir, ['*'], ['application.hbs'])
      ).toThrowErrorMatchingInlineSnapshot(`"No files matching the pattern were found: \\"*\\""`);
    });
  });
});

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

  describe('relative path', function () {
    it('resolves a relative path pattern', function () {
      // To build a relative path from a tmp directory to another, we need the
      // last two segments (a randomly generated directory name and  the name of
      // our project: `fake-project`).
      //
      // For reference, here is how the node package `tmp` creates file paths:
      // https://github.com/raszi/node-tmp/blob/b6465b0665b9d7a788460386a1d9b04870d72532/lib/tmp.js#L470
      //
      // So, from `project`'s absolute path, we take the last two segments.
      let projectSegments = project.path().split('/');
      let randomDirectoryName = projectSegments[projectSegments.length - 2];
      let projectName = projectSegments[projectSegments.length - 1];
      let relativePathToTemplate = `../../${randomDirectoryName}/${projectName}/application.hbs`;

      // we want to test `expandFileGlobs` with a relative path
      // so, let's change process.cwd to another tmp folder
      new Project('another-fake-project').chdir();

      let files = expandFileGlobs([relativePathToTemplate], []);

      // files is an error thrown by globby
      expect(files).toBe(true);
    });
  });
});

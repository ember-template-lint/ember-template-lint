'use strict';

const { _getFilesToLint: getFilesToLint } = require('../../../bin/ember-template-lint');
const Project = require('../../helpers/fake-project');

const STDIN = '/dev/stdin';

describe('getFilesToLint', function () {
  let project = null;

  beforeEach(function () {
    project = Project.defaultSetup();
    project.chdir();
    project.write({ 'application.hbs': 'almost empty', 'other.hbs': 'ZOMG' });
  });

  afterEach(async function () {
    await project.dispose();
  });

  // yarn ember-template-lint --filename application.hbs < application.hbs
  describe('when given empty array', function () {
    it('returns a set including stdin', async function () {
      let files = await getFilesToLint([], 'other.hbs');

      expect(files.size).toBe(1);
      expect(files.values()).toContain(STDIN);
    });
  });

  // cat applications.hbs | yarn ember-template-lint --filename application.hbs STDIN
  describe('when given stdin', function () {
    it('returns a set including stdin', async function () {
      let files = await getFilesToLint([STDIN, 'other.hbs']);

      expect(files.size).toBe(1);
      expect(files.values()).toContain(STDIN);
    });
  });

  if (process.platform !== 'win32') {
    describe("when given stdin through unix's dash", function () {
      // cat applications.hbs | yarn ember-template-lint --filename application.hbs -
      it('returns a set including stdin', async function () {
        let files = await getFilesToLint(['-', 'other.hbs']);

        expect(files.size).toBe(1);
        expect(files.values()).toContain(STDIN);
      });
    });
  }

  // cat applications.hbs | yarn ember-template-lint --filename application.hbs STDIN
  describe('when given a pattern', function () {
    it('returns a set including some files', async function () {
      let files = await getFilesToLint(['app*']);

      expect(files.size).toBe(1);
      expect(files.values()).toContain('application.hbs');
    });
  });
});

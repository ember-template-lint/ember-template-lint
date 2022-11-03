import { getFilesToLint } from '../../../lib/helpers/cli.js';
import { setupProject, teardownProject } from '../../helpers/bin-tester.js';

const STDIN = '/dev/stdin';

describe('getFilesToLint', function () {
  let project = null;
  beforeEach(async function () {
    project = await setupProject();
    await project.chdir();
    await project.write({ 'application.hbs': 'almost empty', 'other.hbs': 'ZOMG' });
    await project.write({
      'application.hbs': 'almost empty',
      'other.hbs': 'ZOMG',
      'js-module.js': 'export const two = 2;',
      'ts-module.ts': 'export const two = 2;',
      'gjs-module.gjs': 'export const two = 2;',
      'gts-module.gts': 'export const two = 2;',
    });
  });

  afterEach(function () {
    teardownProject();
  });

  // npx ember-template-lint --filename application.hbs < application.hbs
  describe('when given empty array', function () {
    it('returns a set including stdin', async function () {
      let files = await getFilesToLint(project.baseDir, [], 'other.hbs');

      expect(files.size).toBe(1);
      expect(files.values()).toContain(STDIN);
    });
  });

  // cat applications.hbs | npx ember-template-lint --filename application.hbs STDIN
  describe('when given stdin', function () {
    it('returns a set including stdin', async function () {
      let files = await getFilesToLint(project.baseDir, [STDIN, 'other.hbs']);

      expect(files.size).toBe(1);
      expect(files.values()).toContain(STDIN);
    });
  });

  if (process.platform !== 'win32') {
    describe("when given stdin through unix's dash", function () {
      // cat applications.hbs | npx ember-template-lint --filename application.hbs -
      it('returns a set including stdin', async function () {
        let files = await getFilesToLint(project.baseDir, ['-', 'other.hbs']);

        expect(files.size).toBe(1);
        expect(files.values()).toContain(STDIN);
      });
    });
  }

  describe('when given a pattern', function () {
    it('returns a set including some files', async function () {
      let files = await getFilesToLint(project.baseDir, ['app*']);

      expect(files.size).toBe(1);
      expect(files.values()).toContain('application.hbs');
    });
  });

  describe('when given a specific path', function () {
    it('returns a set including some files', async function () {
      let files = await getFilesToLint(project.baseDir, ['application.hbs']);

      expect(files.size).toBe(1);
      expect(files.values()).toContain('application.hbs');
    });

    it('supports arbitrary extension when explictly passed', async function () {
      await project.write({ 'foo.frizzle': 'whatever' });

      let files = await getFilesToLint(project.baseDir, ['foo.frizzle']);

      expect(files).toEqual(new Set(['foo.frizzle']));
    });
  });
});

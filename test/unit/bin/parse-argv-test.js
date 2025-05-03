import { parseArgv } from '../../../lib/helpers/cli.js';

describe('parseArgv', function () {
  describe('--format', function () {
    it('parses --format option and defaults correctly', function () {
      let argv = parseArgv(['--format']);
      expect(argv.format).toBe('pretty');
    });

    it('parses --format=json option', function () {
      let argv = parseArgv(['--format', 'json']);
      expect(argv.format).toBe('json');
    });

    it('parses --format option with other args before', function () {
      let argv = parseArgv(['.', '--format=json']);
      expect(argv.format).toBe('json');
    });

    it('parses --format option with other args after', function () {
      let argv = parseArgv(['--format=json', '.']);
      expect(argv.format).toBe('json');
    });
  });

  describe('--fix', function () {
    it('parses --fix option and defaults to true', function () {
      let argv = parseArgv(['--fix']);
      expect(argv.fix).toBe(true);
    });

    it('parses --fix false option', function () {
      let argv = parseArgv(['--fix', 'false', 'other']);
      expect(argv.fix).toBe(false);
    });

    it('parses --fix option with other args before', function () {
      let argv = parseArgv(['.', '--fix']);
      expect(argv.fix).toBe(true);
    });

    it('parses --fix option with other args after', function () {
      let argv = parseArgv(['--fix', '.']);
      expect(argv.fix).toBe(true);
    });
  });
});

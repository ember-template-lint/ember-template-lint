'use strict';

const { _parseArgv: parseArgv } = require('../../../bin/ember-template-lint');

describe('parseArgv', function () {
  describe('--json', function () {
    it('parses --json option and defaults to true', function () {
      let argv = parseArgv(['--json']);
      expect(argv.json).toBe(true);
    });

    it('parses --json false option', function () {
      let argv = parseArgv(['--json', 'false', 'other']);
      expect(argv.json).toBe(false);
    });

    it('parses --json option with other args before', function () {
      let argv = parseArgv(['.', '--json']);
      expect(argv.json).toBe(true);
    });

    it('parses --json option with other args after', function () {
      let argv = parseArgv(['--json', '.']);
      expect(argv.json).toBe(true);
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

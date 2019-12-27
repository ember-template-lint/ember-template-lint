'use strict';

const execa = require('execa');
const BinScript = require('../../bin/ember-template-lint');

describe('ember-template-lint executable', function() {
  describe('_parseArgv', function() {
    it('handles --config-path', function() {
      let argv = ['--config-path', 'foo.js'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --filename', function() {
      let argv = ['--filename', 'foo.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { filename: 'foo.hbs' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --quiet', function() {
      let argv = ['--quiet'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { quiet: true }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --verbose', function() {
      let argv = ['--verbose'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { verbose: true }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --json', function() {
      let argv = ['--json'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { json: true }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('handles --print-pending', function() {
      let argv = ['--print-pending'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { printPending: true }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes a single "--flag value" properly', function() {
      let argv = ['--config-path', 'foo.js'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes a multiple "--flag value" properly', function() {
      let argv = ['--config-path', 'foo.js', '--filename', 'baz.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js', filename: 'baz.hbs' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes a single "--flag=value" properly', function() {
      let argv = ['--config-path=foo.js'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes multiple "--flag=value" properly', function() {
      let argv = ['--config-path=foo.js', '--filename=foo.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js', filename: 'foo.hbs' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes "--flag=value --other-flag value" properly', function() {
      let argv = ['--config-path', 'foo.js', '--filename=foo.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = { named: { configPath: 'foo.js', filename: 'foo.hbs' }, positional: [] };

      expect(actual).toEqual(expected);
    });

    it('processes positional arguments', function() {
      let argv = ['foo/bar.hbs', 'baz/qux.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = {
        named: {},
        positional: ['foo/bar.hbs', 'baz/qux.hbs'],
      };

      expect(actual).toEqual(expected);
    });

    it('does not add -- to the list of positional arguments', function() {
      let argv = ['--config-path', 'foo.js', '--', 'foo/bar.hbs', 'baz/qux.hbs'];

      let actual = BinScript._parseArgv(argv);
      let expected = {
        named: { configPath: 'foo.js' },
        positional: ['foo/bar.hbs', 'baz/qux.hbs'],
      };

      expect(actual).toEqual(expected);
    });

    it('named arguments are not allowed after `--`', function() {
      let argv = [
        '--config-path',
        'foo.js',
        '--',
        'foo/bar.hbs',
        'baz/qux.hbs',
        '--filename',
        'bar.hbs',
      ];

      let actual = BinScript._parseArgv(argv);
      let expected = {
        named: { configPath: 'foo.js' },
        positional: ['foo/bar.hbs', 'baz/qux.hbs', '--filename', 'bar.hbs'],
      };

      expect(actual).toEqual(expected);
    });
  });
});

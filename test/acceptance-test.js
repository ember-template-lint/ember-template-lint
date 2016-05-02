var path = require('path');
var fs = require('fs');
var Linter = require('../lib/index');
var assert = require('power-assert');

var fixturePath = path.join(__dirname, 'fixtures');
var initialCWD = process.cwd();

describe('public api', function() {
  function buildFakeConsole() {
    return {
      _logLines: [],

      log: function(data) {
        this._logLines.push(data);
      }
    };
  }

  var mockConsole;
  beforeEach(function() {
    mockConsole = buildFakeConsole();
  });

  afterEach(function() {
    process.chdir(initialCWD);
  });

  describe('Linter.prototype.loadConfig', function() {
    it('uses provided config', function() {
      var config = {};
      var linter = new Linter({
        console: mockConsole,
        config: config
      });

      assert(linter.config === config);
    });

    it('uses .template-lintrc.js in cwd if present', function() {
      var basePath = path.join(fixturePath, 'config-in-root');
      var expected = require(path.join(basePath, '.template-lintrc'));

      process.chdir(basePath);

      var linter = new Linter({
        console: mockConsole
      });

      assert(linter.config === expected);
    });

    it('uses .template-lintrc in provided configPath', function() {
      var basePath = path.join(fixturePath, 'config-in-root');
      var configPath = path.join(basePath, '.template-lintrc.js');
      var expected = require(configPath);

      process.chdir(basePath);

      var linter = new Linter({
        console: mockConsole,
        configPath: configPath
      });

      assert(linter.config === expected);
    });
  });

  describe('Linter.prototype.constructor', function() {
    it('should be able to instantiate without options', function() {
      assert(new Linter());
    });

    it('accepts a fake console implementation', function() {
      var linter = new Linter({
        console: {
          log: function(message) {
            actual = message;
          }
        }
      });
      var expected = 'foo bar widget';
      var actual;

      linter.console.log(expected);
      assert(expected === actual);
    });
  });

  describe('Linter.prototype.verify', function() {
    var basePath = path.join(fixturePath, 'with-errors');
    var linter;

    beforeEach(function() {
      linter = new Linter({
        console: mockConsole,
        configPath: path.join(basePath, '.template-lintrc.js')
      });
    });

    it('returns an array of issues with the provided template', function() {
      var templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      var templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      var expected = [
        {
          message: 'Non-translated string used',
          moduleId: templatePath,
          line: 1,
          column: 4,
          source: 'Here too!!',
          rule: 'bare-strings',
          severity: 2
        }, {
          message: 'Non-translated string used',
          moduleId: templatePath,
          line: 2,
          column: 5,
          source: 'Bare strings are bad...',
          rule: 'bare-strings',
          severity: 2
        }
      ];

      var result = linter.verify({
        source: templateContents,
        moduleId: templatePath
      });

      assert.deepEqual(result, expected);
    });

    it('returns a "fatal" result object if an error occurs during parsing', function() {
      var template = '<div>';
      var result = linter.verify({
        source: template
      });

      assert(result[0].fatal === true);
    });

    it('defaults all messages to warning severity level when module listed in pending', function() {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'bare-strings': true },
          pending: ['some/path/here']
        }
      });

      var template = '<div>bare string</div>';
      var result = linter.verify({
        source: template,
        moduleId: 'some/path/here'
      });

      var expected = {
        message: 'Non-translated string used',
        moduleId: 'some/path/here',
        line: 1,
        column: 5,
        source: 'bare string',
        rule: 'bare-strings',
        severity: 1
      };

      assert.deepEqual(result, [expected]);
    });

    it('module listed in pending passes an error results', function() {
      linter = new Linter({
        console: mockConsole,
        config: {
          rules: { 'bare-strings': true },
          pending: ['some/path/here']
        }
      });

      var template = '<div></div>';
      var result = linter.verify({
        source: template,
        moduleId: 'some/path/here'
      });

      var expected = {
        message: 'Pending module (`some/path/here`) passes all rules. Please remove `some/path/here` from pending list.',
        moduleId: 'some/path/here',
        severity: 2
      };

      assert.deepEqual(result, [expected]);
    });
  });

  describe('Linter.prototype.isPending', function() {
    it('returns true when the provided moduleId is listed in `pending`', function() {
      var linter = new Linter({
        console: mockConsole,
        config: {
          pending: [
            'some/path/here'
          ]
        }
      });

      assert(linter.isPending('some/path/here'));
      assert(!linter.isPending('some/other/path'));
    });
  });
});

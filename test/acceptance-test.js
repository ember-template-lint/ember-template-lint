var path = require('path');
var fs = require('fs');
var Linter = require('../lib/index');
var assert = require('power-assert');

var fixturePath = path.join(__dirname, 'fixtures');
var initialCWD = process.cwd();

describe.only('public api', function() {
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
    it('uses .template-lintrc.js in cwd if present', function() {
      var basePath = path.join(fixturePath, 'config-in-root');
      var expected = require(path.join(basePath, '.template-lintrc'));

      process.chdir(basePath);

      var linter = new Linter({
        console: mockConsole
      });

      assert(linter.config, expected);
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

      assert(linter.config, expected);
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

    it('logs issues with the provided template', function() {
      var templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      var templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });

      linter.verify({
        source: templateContents,
        moduleId: templatePath
      });

      var combinedLog = mockConsole._logLines.join('\n');

      assert(combinedLog.indexOf('Here too!') > -1);
      assert(combinedLog.indexOf('Bare strings are bad') > -1);
    });

    it('returns an array of issues with the provided template', function() {
      var templatePath = path.join(basePath, 'app', 'templates', 'application.hbs');
      var templateContents = fs.readFileSync(templatePath, { encoding: 'utf8' });
      var expected = [
        {
          message: 'Non-translated string used (\'' + __dirname + '/fixtures/with-errors/app/templates/application.hbs\'@ L1:C4): `Here too!!`.',
          rule: 'bare-strings',
          moduleId: templatePath
        }, {
          message: 'Non-translated string used (\'' + __dirname + '/fixtures/with-errors/app/templates/application.hbs\'@ L2:C5): `Bare strings are bad...`.',
          rule: 'bare-strings',
          moduleId: templatePath
        }
      ];

      var result = linter.verify({
        source: templateContents,
        moduleId: templatePath
      });

      assert.deepEqual(result, expected);
    });
  });
});

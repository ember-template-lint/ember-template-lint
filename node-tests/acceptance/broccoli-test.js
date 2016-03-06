'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('assert');
var broccoliTestHelpers = require('broccoli-test-helpers');
var makeTestHelper = broccoliTestHelpers.makeTestHelper;
var cleanupBuilders = broccoliTestHelpers.cleanupBuilders;

var TemplateLinter = require('../../broccoli-template-linter');
var fixturePath = path.join(process.cwd(), 'node-tests', 'fixtures');

describe('broccoli-template-linter', function() {
  function makeBuilder(fixturePath) {
    return makeTestHelper({
      subject: TemplateLinter,
      fixturePath: fixturePath
    });
  }

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
    cleanupBuilders();
  });

  it('uses .template-lintrc in cwd if present', function() {
    var basePath = path.join(fixturePath, 'config-in-root');
    var builder = makeBuilder(basePath);
    var expected = require(path.join(basePath, '.template-lintrc'));

    return builder('app')
      .then(function(results) {
        var linter = results.subject;
        assert.deepEqual(linter.loadConfig(), expected);
      });
  });

  it('uses .template-lintrc in provided templatercPath', function() {
    var basePath = path.join(fixturePath, 'config-in-root');
    var builder = makeBuilder(fixturePath);
    var expected = require(path.join(basePath, '.template-lintrc'));

    return builder('config-in-root/app', { templatercPath: path.join(basePath, '.template-lintrc')})
      .then(function(results) {
        var linter = results.subject;
        assert.deepEqual(linter.loadConfig(), expected);
      });
  });

  it('uses provided generateTestFile to return a test file', function() {
    var basePath = path.join(fixturePath, 'with-errors');
    var builder = makeBuilder(basePath);

    return builder('app', {
      console: mockConsole,
      generateTestFile: function(moduleName, tests) {
        return tests[0].errorMessage;
      }
    })
      .then(function(results) {
        var outputPath = results.directory;
        var contents = fs.readFileSync(
          path.join(outputPath, 'templates', 'application.template-lint-test.js'),
          { encoding: 'utf8' }
        );

        assert.ok(contents.indexOf('Here too!') > -1);
        assert.ok(contents.indexOf('Bare strings are bad') > -1);
      });
  });

  it('returns an empty string if no generateTestFile is provided', function() {
    var basePath = path.join(fixturePath, 'with-errors');
    var builder = makeBuilder(basePath);

    return builder('app', {
      console: mockConsole
    })
      .then(function(results) {
        var outputPath = results.directory;
        var contents = fs.readFileSync(
          path.join(outputPath, 'templates', 'application.template-lint-test.js'),
          { encoding: 'utf8' }
        );

        assert.equal(contents, '');
      });
  });

  it('prints warnings to console', function() {
    var basePath = path.join(fixturePath, 'with-errors');
    var builder = makeBuilder(basePath);

    return builder('app', {
      persist: false, // console messages are only printed when initially processed
      console: mockConsole,
      generateTestFile: function(moduleName, tests) {
        return tests[0].errorMessage;
      }
    })
      .then(function() {
        assert.ok(mockConsole._logLines[0].indexOf('Here too!') > -1);
        assert.ok(mockConsole._logLines[1].indexOf('Bare strings are bad') > -1);
      });
  });

});

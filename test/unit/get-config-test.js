var path = require('path');
var assert = require('power-assert');
var clone = require('lodash').clone;
var getConfig = require('../../lib/get-config');
var recommendedConfig = require('../../lib/config/recommended');

var fixturePath = path.join(__dirname, '..', 'fixtures');
var initialCWD = process.cwd();

describe('get-config', function() {
  afterEach(function() {
    process.chdir(initialCWD);
  });

  it('if config is provided, it is returned', function() {
    var expected = { };
    var actual = getConfig({ config: expected });

    assert(actual == expected);
  });

  it('uses .template-lintrc.js in cwd if present', function() {
    var basePath = path.join(fixturePath, 'config-in-root');
    var expected = require(path.join(basePath, '.template-lintrc'));

    process.chdir(basePath);

    var actual = getConfig({});

    assert.deepEqual(actual, expected);
  });

  it('uses .template-lintrc in provided configPath', function() {
    var basePath = path.join(fixturePath, 'config-in-root');
    var configPath = path.join(basePath, '.template-lintrc.js');
    var expected = require(configPath);

    process.chdir(basePath);

    var actual = getConfig({
      configPath: configPath
    });

    assert.deepEqual(actual, expected);
  });

  it('can specify that it extends a default configuration', function() {
    var actual = getConfig({
      config: {
        extends: 'recommended'
      }
    });

    assert.deepEqual(actual, recommendedConfig);
  });

  it('can extend and override a default configuration', function() {
    var expected = clone(recommendedConfig);
    expected.rules['bare-strings'] = false;

    var actual = getConfig({
      config: {
        extends: 'recommended',
        rules: {
          'bare-strings': false
        }
      }
    });

    assert.deepEqual(actual, expected);
    assert(actual.rules['bare-strings'] === false);
  });

  it('migrates rules in the config root into `rules` property', function() {
    var expected = { rules: { 'bare-strings': true }};
    var actual = getConfig({
      console: { log: function() { }},
      config: {
        'bare-strings': true
      }
    });

    assert.deepEqual(actual, expected);
  });

  it('rules in the config root trigger a deprecation', function() {
    var message;
    getConfig({
      console: { log: function(_message) {
        message = _message;
      }},

      config: {
        'bare-strings': true
      }
    });

    assert(/Rule configuration has been moved/.test(message));
  });
});
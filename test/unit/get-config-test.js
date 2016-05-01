var path = require('path');
var assert = require('power-assert');
var assign = require('lodash.assign');
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
    var expected = assign({}, recommendedConfig, { 'bare-strings': false });
    var actual = getConfig({
      config: {
        extends: 'recommended',
        'bare-strings': false
      }
    });

    assert.deepEqual(actual, expected);
    assert(actual['bare-strings'] === false);
  });
});
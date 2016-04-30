var path = require('path');
var assert = require('power-assert');
var getConfig = require('../../lib/get-config');

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
});
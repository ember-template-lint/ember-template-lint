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

    assert(actual.rules['block-indentation'] === 2);

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

    assert(actual.rules['bare-strings'] === false);
  });

  it('migrates rules in the config root into `rules` property', function() {
    var actual = getConfig({
      console: { log: function() { }},
      config: {
        'bare-strings': false
      }
    });

    assert(actual.rules['bare-strings'] === false);
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

  it('warns for unknown rules', function() {
    var message;
    getConfig({
      console: { log: function(_message) {
        message = _message;
      }},

      config: {
        rules: {
          'blammo': true
        }
      }
    });

    assert(/Invalid rule configuration found/.test(message));
  });

  it('warns for unknown extends', function() {
    var message;
    getConfig({
      console: { log: function(_message) {
        message = _message;
      }},

      config: {
        extends: [
          'recommended',
          'plugin1:wrong-extend'
        ]
      }
    });

    assert(/Cannot find configuration for extends/.test(message));
  });

  it('can specify plugin without rules', function() {
    var message;
    var actual = getConfig({
      console: { log: function(_message) {
        message = _message;
      }},

      config: {

        extends: 'myplugin:basic-configuration',

        plugins: [{
          name: 'myplugin',
          configurations: {
            'basic-configuration': {
              rules: {
                'bare-strings': false
              }
            }
          }
        }]
      }

    });

    assert(!message);
    assert(actual.rules['bare-strings'] === false);
  });

  it('throw exception when plugin path is incorrect', function() {

    var wrongPluginPath = './bad-plugin-path/incorrect-file-name';

    assert.throws(function() {
      getConfig({
        config: {
          plugins: [wrongPluginPath]
        }
      });
    });


  });

  it('validates non-default loaded rules', function() {
    var message;
    var actual = getConfig({
      console: { log: function(_message) {
        message = _message;
      }},

      config: {

        rules: {
          'foo-bar': true
        },

        plugins: [{
          name: 'myplugin',
          rules: {
            'foo-bar': 'plugin-function-placeholder'
          }
        }]
      }

    });

    assert(!message);
    assert(actual.loadedRules['foo-bar'] === 'plugin-function-placeholder');
  });

  it('getting config is idempotent', function() {
    var firstMessage;
    var secondMessage;
    var firstPass = getConfig({
      console: { log: function(_message) {
        firstMessage = _message;
      }},

      config: {

        rules: {
          'foo-bar': true
        },

        plugins: [{
          name: 'myplugin',
          rules: {
            'foo-bar': 'plugin-function-placeholder'
          }
        }]
      }

    });
    var firstPassJSON = JSON.stringify(firstPass);
    var secondPass = getConfig({
      console: { log: function(_message) {
        secondMessage = _message;
      }},

      config: firstPass

    });
    var secondPassJSON = JSON.stringify(secondPass);

    assert(firstPassJSON === secondPassJSON);
    assert(!firstMessage);
    assert(!secondMessage);
  });

});

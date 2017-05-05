var path = require('path');
var expect = require('chai').expect;
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

    expect(actual).to.equal(expected);
  });

  it('uses .template-lintrc.js in cwd if present', function() {
    var basePath = path.join(fixturePath, 'config-in-root');
    var expected = require(path.join(basePath, '.template-lintrc'));

    process.chdir(basePath);

    var actual = getConfig({});

    expect(actual).to.deep.equal(expected);
  });

  it('uses .template-lintrc in provided configPath', function() {
    var basePath = path.join(fixturePath, 'config-in-root');
    var configPath = path.join(basePath, '.template-lintrc.js');
    var expected = require(configPath);

    process.chdir(basePath);

    var actual = getConfig({
      configPath: configPath
    });

    expect(actual).to.deep.equal(expected);
  });

  it('can specify that it extends a default configuration', function() {
    var actual = getConfig({
      config: {
        extends: 'recommended'
      }
    });

    expect(actual.rules['block-indentation']).to.equal(2);
  });

  it('can extend and override a default configuration', function() {
    var expected = clone(recommendedConfig);
    expected.rules['bare-strings'] = true;

    var actual = getConfig({
      config: {
        extends: 'recommended',
        rules: {
          'bare-strings': false
        }
      }
    });

    expect(actual.rules['bare-strings']).to.be.false;
  });

  it('migrates rules in the config root into `rules` property', function() {
    var actual = getConfig({
      console: { log: function() { }},
      config: {
        'bare-strings': false
      }
    });

    expect(actual.rules['bare-strings']).to.be.false;
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

    expect(message).to.match(/Rule configuration has been moved/);
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

    expect(message).to.match(/Invalid rule configuration found/);
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

    expect(message).to.match(/Cannot find configuration for extends/);
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

    expect(message).to.not.be.ok;
    expect(actual.rules['bare-strings']).to.be.false;
  });

  it('throw exception when plugin path is incorrect', function() {
    var wrongPluginPath = './bad-plugin-path/incorrect-file-name';

    expect(function() {
      getConfig({
        config: {
          plugins: [wrongPluginPath]
        }
      });
    }).to.throw;
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

    expect(message).to.not.be.ok;
    expect(actual.loadedRules['foo-bar']).to.equal('plugin-function-placeholder');
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

    expect(firstPassJSON).to.equal(secondPassJSON);
    expect(firstMessage).to.not.be.ok;
    expect(secondMessage).to.not.be.ok;
  });

});

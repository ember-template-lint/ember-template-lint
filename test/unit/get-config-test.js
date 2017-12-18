'use strict';

const path = require('path');
const expect = require('chai').expect;
const getConfig = require('../../lib/get-config');
const recommendedConfig = require('../../lib/config/recommended');

const fixturePath = path.join(__dirname, '..', 'fixtures');
const initialCWD = process.cwd();

describe('get-config', function() {
  afterEach(function() {
    process.chdir(initialCWD);
  });

  it('if config is provided, it is returned', function() {
    let basePath = path.join(fixturePath, 'config-in-root');
    let expected = require(path.join(basePath, '.template-lintrc'));

    let actual = getConfig({ config: expected });

    expect(actual.rules).to.deep.equal(expected.rules);
  });

  it('uses .template-lintrc.js in cwd if present', function() {
    let basePath = path.join(fixturePath, 'config-in-root');
    let expected = require(path.join(basePath, '.template-lintrc'));

    process.chdir(basePath);

    let actual = getConfig({});

    expect(actual.rules).to.deep.equal(expected.rules);
  });

  it('uses .template-lintrc in provided configPath', function() {
    let basePath = path.join(fixturePath, 'config-in-root');
    let configPath = path.join(basePath, '.template-lintrc.js');
    let expected = require(configPath);

    process.chdir(basePath);

    let actual = getConfig({
      configPath: configPath
    });

    expect(actual.rules).to.deep.equal(expected.rules);
  });

  it('can specify that it extends a default configuration', function() {
    let actual = getConfig({
      config: {
        extends: 'recommended'
      }
    });

    expect(actual.rules['block-indentation']).to.equal(2);
  });

  it('can extend and override a default configuration', function() {
    let expected = recommendedConfig;

    let actual = getConfig({
      config: {
        extends: 'recommended',
        rules: {
          'block-indentation': 4
        }
      }
    });

    expect(actual.rules['block-indentation']).to.equal(4);
    expect(actual.rules['block-indentation']).to.not.equal(expected.rules['block-indentation']);
  });

  it('migrates rules in the config root into `rules` property', function() {
    let actual = getConfig({
      console: { log() { }},
      config: {
        'bare-strings': false
      }
    });

    expect(actual.rules['bare-strings']).to.be.false;
  });

  it('rules in the config root trigger a deprecation', function() {
    let message;
    getConfig({
      console: { log(_message) {
        message = _message;
      }},

      config: {
        'bare-strings': true
      }
    });

    expect(message).to.match(/Rule configuration has been moved/);
  });

  it('warns for unknown rules', function() {
    let message;
    getConfig({
      console: { log(_message) {
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
    let message;
    getConfig({
      console: { log(_message) {
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
    let message;
    let actual = getConfig({
      console: { log(_message) {
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
    let wrongPluginPath = './bad-plugin-path/incorrect-file-name';

    expect(function() {
      getConfig({
        config: {
          plugins: [wrongPluginPath]
        }
      });
    }).to.throw;
  });

  it('validates non-default loaded rules', function() {
    let message;
    let actual = getConfig({
      console: { log(_message) {
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
    let firstMessage;
    let secondMessage;
    let firstPass = getConfig({
      console: { log(_message) {
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
    let firstPassJSON = JSON.stringify(firstPass);
    let secondPass = getConfig({
      console: { log(_message) {
        secondMessage = _message;
      }},

      config: firstPass

    });
    let secondPassJSON = JSON.stringify(secondPass);

    expect(firstPassJSON).to.equal(secondPassJSON);
    expect(firstMessage).to.not.be.ok;
    expect(secondMessage).to.not.be.ok;
  });

  it('does no mutate the config', function() {
    let config = {
      config: {
        extends: 'recommended'
      }
    };

    let cloned = JSON.parse(JSON.stringify(config));

    let actual = getConfig(config);

    expect(Object.keys(actual.rules), 'make sure the operation would have resulted in a mutated object').to.not.equal(0);
    expect(config, 'assert object matches its original clone').to.deep.equal(cloned);
  });
});

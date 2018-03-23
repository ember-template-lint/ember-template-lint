'use strict';

const path = require('path');
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

    expect(actual.rules).toEqual(expected.rules);
  });

  it('uses .template-lintrc.js in cwd if present', function() {
    let basePath = path.join(fixturePath, 'config-in-root');
    let expected = require(path.join(basePath, '.template-lintrc'));

    process.chdir(basePath);

    let actual = getConfig({});

    expect(actual.rules).toEqual(expected.rules);
  });

  it('uses .template-lintrc in provided configPath', function() {
    let basePath = path.join(fixturePath, 'config-in-root');
    let configPath = path.join(basePath, '.template-lintrc.js');
    let expected = require(configPath);

    process.chdir(basePath);

    let actual = getConfig({
      configPath: configPath
    });

    expect(actual.rules).toEqual(expected.rules);
  });

  it('can specify that it extends a default configuration', function() {
    let actual = getConfig({
      config: {
        extends: 'recommended'
      }
    });

    expect(actual.rules['block-indentation']).toEqual(2);
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

    expect(actual.rules['block-indentation']).toEqual(4);
    expect(actual.rules['block-indentation']).not.toEqual(expected.rules['block-indentation']);
  });

  it('migrates rules in the config root into `rules` property', function() {
    let actual = getConfig({
      console: { log() { }},
      config: {
        'bare-strings': false
      }
    });

    expect(actual.rules['bare-strings']).toBe(false);
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

    expect(message).toMatch(/Rule configuration has been moved/);
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

    expect(message).toMatch(/Invalid rule configuration found/);
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

    expect(message).toMatch(/Cannot find configuration for extends/);
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

    expect(message).not.toBeTruthy();
    expect(actual.rules['bare-strings']).toBe(false);
  });

  it('throw exception when plugin path is incorrect', function() {
    let wrongPluginPath = './bad-plugin-path/incorrect-file-name';

    expect(function() {
      getConfig({
        config: {
          plugins: [wrongPluginPath]
        }
      });
    }).toThrow();
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

    expect(message).not.toBeTruthy();
    expect(actual.loadedRules['foo-bar']).toEqual('plugin-function-placeholder');
  });

  it('can chain extends and load rules across chained plugins', function() {
    let message;
    let actual = getConfig({
      console: { log(_message) {
        message = _message;
      }},

      config: {
        extends: 'plugin1:recommended',

        plugins: [{
          name: 'plugin1',

          configurations: {
            recommended: {
              extends: 'plugin2:recommended',

              plugins: [{
                name: 'plugin2',

                rules: {
                  'foo-bar': true
                },

                configurations: {
                  recommended: {
                    extends: 'recommended',

                    rules: {
                      'foo-bar': true
                    }
                  }
                }
              }]
            }
          }
        }]
      }

    });

    expect(message).not.toBeTruthy();
    expect(actual.rules['foo-bar']).toEqual(true);
    expect(actual.rules['block-indentation']).toEqual(2);
  });

  it('handles circular reference in config', function() {
    let message;

    let config = {
      extends: 'plugin1:recommended',

      rules: {
        'foo-bar': true
      },

      plugins: [{
        name: 'plugin1',

        rules: {
          'foo-bar': true
        },

        configurations: {}
      }]
    };

    config.plugins[0].configurations.recommended = config;

    let actual = getConfig({
      console: { log(_message) {
        message = _message;
      }},

      config

    });

    expect(message).not.toBeTruthy();
    expect(actual.rules['foo-bar']).toEqual(true);
  });

  it('handles circular reference in plugin', function() {
    let message;

    let plugin = {
      name: 'plugin1',

      rules: {
        'foo-bar': true
      },

      configurations: {
        recommended: {
          extends: 'plugin1:recommended',

          rules: {
            'foo-bar': true
          },
        }
      }
    };

    plugin.configurations.recommended.plugins = [plugin];

    let actual = getConfig({
      console: { log(_message) {
        message = _message;
      }},

      config: {
        extends: 'plugin1:recommended',

        plugins: [plugin]
      }

    });

    expect(message).not.toBeTruthy();
    expect(actual.rules['foo-bar']).toEqual(true);
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

    expect(firstPassJSON).toEqual(secondPassJSON);
    expect(firstMessage).not.toBeTruthy();
    expect(secondMessage).not.toBeTruthy();
  });

  it('does not mutate the config', function() {
    let config = {
      config: {
        extends: 'recommended'
      }
    };

    let cloned = JSON.parse(JSON.stringify(config));

    let actual = getConfig(config);

    // make sure the operation would have resulted in a mutated object
    expect(actual.rules).not.toEqual({});
    // assert object matches its original clone
    expect(config).toEqual(cloned);
  });
});

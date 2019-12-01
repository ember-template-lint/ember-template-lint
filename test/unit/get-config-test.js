'use strict';

const path = require('path');
const getConfig = require('../../lib/get-config');
const recommendedConfig = require('../../lib/config/recommended');
const { createTempDir } = require('broccoli-test-helper');

const initialCWD = process.cwd();

describe('get-config', function() {
  let project = null;
  beforeEach(async function() {
    project = await createTempDir();
    process.chdir(project.path());
  });
  afterEach(async function() {
    process.chdir(initialCWD);
    await project.dispose();
  });

  it('if config is provided, it is returned', function() {
    let expected = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };
    project.write({
      '.template-lintrc.js': `module.exports = ${JSON.stringify(expected)};`,
      app: {
        templates: {
          'application.hbs': '',
        },
      },
    });
    let actual = getConfig({ config: expected });
    expect(actual.rules).toEqual(expected.rules);
  });

  it('uses .template-lintrc.js in cwd if present', function() {
    let expected = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };
    project.write({
      '.template-lintrc.js': `module.exports = ${JSON.stringify(expected)};`,
      app: {
        templates: {
          'application.hbs': '',
        },
      },
    });
    let actual = getConfig({});

    expect(actual.rules).toEqual(expected.rules);
  });

  it('uses .template-lintrc in provided configPath', function() {
    let configPath = path.join(project.path(), '.template-lintrc.js');

    let expected = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };
    project.write({
      '.template-lintrc.js': `module.exports = ${JSON.stringify(expected)};`,
      app: {
        templates: {
          'application.hbs': '',
        },
      },
    });

    let actual = getConfig({
      configPath,
    });

    expect(actual.rules).toEqual(expected.rules);
  });

  it('can specify that it extends a default configuration', function() {
    let actual = getConfig({
      config: {
        extends: 'recommended',
      },
    });

    expect(actual.rules['no-debugger']).toBe(true);
  });

  it('can extend and override a default configuration', function() {
    let expected = recommendedConfig;

    let actual = getConfig({
      config: {
        extends: 'recommended',
        rules: {
          'block-indentation': 4,
        },
      },
    });

    expect(actual.rules['block-indentation']).toEqual(4);
    expect(actual.rules['block-indentation']).not.toEqual(expected.rules['block-indentation']);
  });

  it('migrates rules in the config root into `rules` property', function() {
    let actual = getConfig({
      console: { log() {} },
      config: {
        'no-bare-strings': false,
      },
    });

    expect(actual.rules['no-bare-strings']).toBe(false);
  });

  it('rules in the config root trigger a deprecation', function() {
    let message;
    getConfig({
      console: {
        log(_message) {
          message = _message;
        },
      },

      config: {
        'no-bare-strings': true,
      },
    });

    expect(message).toMatch(/Rule configuration has been moved/);
  });

  it('warns for unknown rules', function() {
    let message;
    getConfig({
      console: {
        log(_message) {
          message = _message;
        },
      },

      config: {
        rules: {
          blammo: true,
        },
      },
    });

    expect(message).toMatch(/Invalid rule configuration found/);
  });

  it('warns for unknown extends', function() {
    let message;
    getConfig({
      console: {
        log(_message) {
          message = _message;
        },
      },

      config: {
        extends: ['recommended', 'plugin1:wrong-extend'],
      },
    });

    expect(message).toMatch(/Cannot find configuration for extends/);
  });

  it('extending multiple configurations allows subsequent configs to override earlier ones', function() {
    let actual = getConfig({
      config: {
        extends: ['recommended', 'myplugin:recommended'],

        plugins: [
          {
            name: 'myplugin',
            configurations: {
              recommended: {
                rules: {
                  'no-action': false,
                },
              },
            },
          },
        ],
      },
    });

    expect(actual.rules['no-action']).toBe(false);
  });

  it('extending multiple configurations merges all rules', function() {
    let actual = getConfig({
      config: {
        extends: ['myplugin:first', 'myplugin:second'],

        plugins: [
          {
            name: 'myplugin',
            configurations: {
              first: {
                rules: {
                  'no-action': false,
                },
              },
              second: {
                rules: {
                  'require-valid-alt-text': true,
                },
              },
            },
          },
        ],
      },
    });

    expect(actual.rules).toEqual({
      'no-action': false,
      'require-valid-alt-text': true,
    });
  });

  it('can specify plugin without rules', function() {
    let message;
    let actual = getConfig({
      console: {
        log(_message) {
          message = _message;
        },
      },

      config: {
        extends: 'myplugin:basic-configuration',

        plugins: [
          {
            name: 'myplugin',
            configurations: {
              'basic-configuration': {
                rules: {
                  'no-bare-strings': false,
                },
              },
            },
          },
        ],
      },
    });

    expect(message).toBeFalsy();
    expect(actual.rules['no-bare-strings']).toBe(false);
  });

  it('throw exception when plugin path is incorrect', function() {
    let wrongPluginPath = './bad-plugin-path/incorrect-file-name';

    expect(function() {
      getConfig({
        config: {
          plugins: [wrongPluginPath],
        },
      });
    }).toThrow();
  });

  it('validates non-default loaded rules', function() {
    let message;
    let actual = getConfig({
      console: {
        log(_message) {
          message = _message;
        },
      },

      config: {
        rules: {
          'foo-bar': true,
        },

        plugins: [
          {
            name: 'myplugin',
            rules: {
              'foo-bar': 'plugin-function-placeholder',
            },
          },
        ],
      },
    });

    expect(message).toBeFalsy();
    expect(actual.loadedRules['foo-bar']).toEqual('plugin-function-placeholder');
  });

  it('can chain extends and load rules across chained plugins', function() {
    let message;
    let actual = getConfig({
      console: {
        log(_message) {
          message = _message;
        },
      },

      config: {
        extends: 'plugin1:recommended',

        plugins: [
          {
            name: 'plugin1',

            configurations: {
              recommended: {
                extends: 'plugin2:recommended',

                plugins: [
                  {
                    name: 'plugin2',

                    rules: {
                      'foo-bar': true,
                    },

                    configurations: {
                      recommended: {
                        extends: 'recommended',

                        rules: {
                          'foo-bar': true,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    });

    expect(message).toBeFalsy();
    expect(actual.rules['foo-bar']).toBe(true);
    expect(actual.rules['no-debugger']).toBe(true);
  });

  it('handles circular reference in config', function() {
    let message;

    let config = {
      extends: 'plugin1:recommended',

      rules: {
        'foo-bar': true,
      },

      plugins: [
        {
          name: 'plugin1',

          rules: {
            'foo-bar': true,
          },

          configurations: {},
        },
      ],
    };

    config.plugins[0].configurations.recommended = config;

    let actual = getConfig({
      console: {
        log(_message) {
          message = _message;
        },
      },

      config,
    });

    expect(message).toBeFalsy();
    expect(actual.rules['foo-bar']).toBe(true);
  });

  it('handles circular reference in plugin', function() {
    let message;

    let plugin = {
      name: 'plugin1',

      rules: {
        'foo-bar': true,
      },

      configurations: {
        recommended: {
          extends: 'plugin1:recommended',

          rules: {
            'foo-bar': true,
          },
        },
      },
    };

    plugin.configurations.recommended.plugins = [plugin];

    let actual = getConfig({
      console: {
        log(_message) {
          message = _message;
        },
      },

      config: {
        extends: 'plugin1:recommended',

        plugins: [plugin],
      },
    });

    expect(message).toBeFalsy();
    expect(actual.rules['foo-bar']).toBe(true);
  });

  it('getting config is idempotent', function() {
    let firstMessage;
    let secondMessage;
    let firstPass = getConfig({
      console: {
        log(_message) {
          firstMessage = _message;
        },
      },

      config: {
        rules: {
          'foo-bar': true,
        },

        plugins: [
          {
            name: 'myplugin',
            rules: {
              'foo-bar': 'plugin-function-placeholder',
            },
          },
        ],
      },
    });
    let firstPassJSON = JSON.stringify(firstPass);
    let secondPass = getConfig({
      console: {
        log(_message) {
          secondMessage = _message;
        },
      },

      config: firstPass,
    });
    let secondPassJSON = JSON.stringify(secondPass);

    expect(firstPassJSON).toEqual(secondPassJSON);
    expect(firstMessage).toBeFalsy();
    expect(secondMessage).toBeFalsy();
  });

  it('does not mutate the config', function() {
    let config = {
      config: {
        extends: 'recommended',
      },
    };

    let cloned = JSON.parse(JSON.stringify(config));

    let actual = getConfig(config);

    expect(Object.keys(actual.rules).length).toBeTruthy();
    expect(config).toEqual(cloned);
  });
});

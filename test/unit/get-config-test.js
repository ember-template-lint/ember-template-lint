'use strict';

const {
  getProjectConfig,
  getConfigForFile,
  determineRuleConfig,
  resolveProjectConfig,
  getRuleFromString,
} = require('../../lib/get-config');
const recommendedConfig = require('../../lib/config/recommended');
const buildFakeConsole = require('../helpers/console');
const Project = require('../helpers/fake-project');
const { stripIndent } = require('common-tags');

describe('get-config', function () {
  let project = null;

  beforeEach(function () {
    project = new Project();
  });

  afterEach(async function () {
    await project.dispose();
  });

  it('if config is provided directly, it is used', function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };

    let actual = getProjectConfig({ config });
    expect(actual.rules).toEqual({
      foo: { config: 'bar', severity: 2 },
      baz: { config: 'derp', severity: 2 },
    });
  });

  it('it supports severity level', function () {
    let expected = {
      rules: {
        foo: { config: true, severity: 1 },
        baz: { config: 'derp', severity: 2 },
      },
    };

    let actual = getProjectConfig({
      config: {
        rules: {
          foo: 'warn',
          baz: 'derp',
        },
      },
    });
    expect(actual.rules).toEqual(expected.rules);
  });

  it('shows rules being "upgraded" to the new syntax when the config is in the old syntax', function () {
    let actual = getProjectConfig({
      config: {
        rules: {
          foo: true,
          baz: 'derp',
          biz: ['random', 'data'],
        },
      },
    });

    let expected = {
      rules: {
        foo: { config: true, severity: 2 },
        baz: { config: 'derp', severity: 2 },
        biz: { config: ['random', 'data'], severity: 2 },
      },
    };
    expect(actual.rules).toEqual(expected.rules);
  });

  it('it supports severity level with custom configuration', function () {
    let expected = {
      rules: {
        foo: { config: { allow: [1, 2, 3] }, severity: 1 },
        baz: { config: 'derp', severity: 2 },
        'some-rule': { severity: 2, config: 'lol' },
        'other-thing': { severity: 2, config: ['wat', 'is', 'this'] },
        'hmm-thing-here': { severity: 2, config: { zomg: 'lol' } },
        'another-thing-there': { severity: 0, config: false },
      },
    };

    let actual = getProjectConfig({
      config: {
        rules: {
          foo: ['warn', { allow: [1, 2, 3] }],
          baz: 'derp',
          'some-rule': 'lol',
          'other-thing': ['wat', 'is', 'this'],
          'hmm-thing-here': { zomg: 'lol' },
          'another-thing-there': 'off',
        },
      },
    });
    expect(actual.rules).toEqual(expected.rules);
  });

  it('uses .template-lintrc.js in cwd if present', function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };
    // clone to ensure we are not mutating
    let expected = JSON.parse(JSON.stringify(config));

    project.setConfig(expected);
    project.chdir();

    let actual = getProjectConfig({});

    expect(actual.rules).toEqual({
      foo: { config: 'bar', severity: 2 },
      baz: { config: 'derp', severity: 2 },
    });
  });

  it('uses the specified configPath from cwd', function () {
    let someOtherPathConfig = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };
    project.files['some-other-path.js'] = `module.exports = ${JSON.stringify(
      someOtherPathConfig
    )};`;
    project.chdir();

    let actual = getProjectConfig({ configPath: 'some-other-path.js' });

    expect(actual.rules).toEqual({
      foo: { config: 'bar', severity: 2 },
      baz: { config: 'derp', severity: 2 },
    });
  });

  it('uses the specified configPath outside of cwd', function () {
    let someOtherPathConfig = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };
    project.files['some-other-path.js'] = `module.exports = ${JSON.stringify(
      someOtherPathConfig
    )};`;
    project.writeSync();

    let actual = getProjectConfig({ configPath: project.path('some-other-path.js') });

    expect(actual.rules).toEqual({
      foo: { config: 'bar', severity: 2 },
      baz: { config: 'derp', severity: 2 },
    });
  });

  it('can specify that it extends a default configuration', function () {
    let actual = getProjectConfig({
      config: {
        extends: 'recommended',
      },
    });

    expect(actual.rules['no-debugger']).toEqual({ config: true, severity: 2 });
  });

  it('can extend and override a default configuration', function () {
    let expected = recommendedConfig;

    let actual = getProjectConfig({
      config: {
        extends: 'recommended',
        rules: {
          'block-indentation': 4,
        },
      },
    });

    expect(actual.rules['block-indentation']).toEqual({ config: 4, severity: 2 });
    expect(actual.rules['block-indentation']).not.toEqual(expected.rules['block-indentation']);
  });

  it('migrates rules in the config root into `rules` property', function () {
    let actual = getProjectConfig({
      console: buildFakeConsole(),
      config: {
        'no-bare-strings': false,
      },
    });

    expect(actual.rules['no-bare-strings']).toEqual({ config: false, severity: 0 });
  });

  it('rules in the config root trigger a deprecation', function () {
    let console = buildFakeConsole();

    getProjectConfig({
      console,
      config: {
        'no-bare-strings': true,
      },
    });

    expect(console.stdout).toMatch(/Rule configuration has been moved/);
  });

  it('warns for unknown rules', function () {
    let console = buildFakeConsole();

    getProjectConfig({
      console,
      config: {
        rules: {
          blammo: true,
        },
      },
    });

    expect(console.stdout).toMatch(/Invalid rule configuration found/);
  });

  it('warns for unknown extends', function () {
    let console = buildFakeConsole();

    getProjectConfig({
      console,
      config: {
        extends: ['recommended', 'plugin1:wrong-extend'],
      },
    });

    expect(console.stdout).toMatch(/Cannot find configuration for extends/);
  });

  it('resolves plugins by string', function () {
    let console = buildFakeConsole();

    project.setConfig({
      extends: ['my-awesome-thing:stylistic'],
      plugins: ['my-awesome-thing'],
    });

    project.addDevDependency('my-awesome-thing', '0.0.0', (dep) => {
      dep.files['index.js'] = stripIndent`
        module.exports = {
          name: 'my-awesome-thing',

          configurations: {
            stylistic: {
              rules: {
                quotes: 'single',
              }
            }
          }
        };
      `;
    });

    project.chdir();

    let actual = getProjectConfig({
      console,
    });

    expect(console.stdout).toEqual('');
    expect(actual.rules['quotes']).toEqual({ config: 'single', severity: 2 });
  });

  it('resolves plugins by string when using specified config (not resolved project config)', function () {
    let console = buildFakeConsole();

    project.setConfig();

    project.addDevDependency('my-awesome-thing', '0.0.0', (dep) => {
      dep.files['index.js'] = stripIndent`
        module.exports = {
          name: 'my-awesome-thing',

          configurations: {
            stylistic: {
              rules: {
                quotes: ['error','single'],
              }
            }
          }
        };
      `;
    });

    project.chdir();

    let actual = getProjectConfig({
      console,
      config: {
        extends: ['my-awesome-thing:stylistic'],
        plugins: ['my-awesome-thing'],
      },
    });

    expect(console.stdout).toEqual('');
    expect(actual.rules['quotes']).toEqual({ config: 'single', severity: 2 });
  });

  it('extending multiple configurations allows subsequent configs to override earlier ones', function () {
    let actual = getProjectConfig({
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

    expect(actual.rules['no-action']).toEqual({ config: false, severity: 0 });
  });

  it('extending multiple configurations merges all rules', function () {
    let actual = getProjectConfig({
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
      'no-action': { config: false, severity: 0 },
      'require-valid-alt-text': { config: true, severity: 2 },
    });
  });

  it('can specify plugin without rules', function () {
    let console = buildFakeConsole();

    let actual = getProjectConfig({
      console,
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

    expect(console.stdout).toBeFalsy();
    expect(actual.rules['no-bare-strings']).toEqual({ config: false, severity: 0 });
  });

  it('throw exception when plugin path is incorrect', function () {
    let wrongPluginPath = './bad-plugin-path/incorrect-file-name';

    expect(function () {
      getProjectConfig({
        config: {
          plugins: [wrongPluginPath],
        },
      });
    }).toThrow();
  });

  it('validates non-default loaded rules', function () {
    let console = buildFakeConsole();

    let actual = getProjectConfig({
      console,

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

    expect(console.stdout).toBeFalsy();
    expect(actual.loadedRules['foo-bar']).toEqual('plugin-function-placeholder');
  });

  it('can chain extends and load rules across chained plugins', function () {
    let console = buildFakeConsole();

    let actual = getProjectConfig({
      console,

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

    expect(console.stdout).toBeFalsy();
    expect(actual.rules['foo-bar']).toEqual({ config: true, severity: 2 });
    expect(actual.rules['no-debugger']).toEqual({ config: true, severity: 2 });
  });

  it('handles circular reference in config', function () {
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

    let console = buildFakeConsole();
    let actual = getProjectConfig({
      console,
      config,
    });

    expect(console.stdout).toBeFalsy();
    expect(actual.rules['foo-bar']).toEqual({ config: true, severity: 2 });
  });

  it('handles circular reference in plugin', function () {
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

    let console = buildFakeConsole();
    let actual = getProjectConfig({
      console,

      config: {
        extends: 'plugin1:recommended',

        plugins: [plugin],
      },
    });

    expect(console.stdout).toBeFalsy();
    expect(actual.rules['foo-bar']).toEqual({ config: true, severity: 2 });
  });

  it('getting config is idempotent', function () {
    let console = buildFakeConsole();
    let firstPass = getProjectConfig({
      console,
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
    let secondPass = getProjectConfig({
      console,
      config: firstPass,
    });
    let secondPassJSON = JSON.stringify(secondPass);

    expect(firstPassJSON).toEqual(secondPassJSON);
    expect(console.stdout).toBeFalsy();
  });

  it('does not mutate the config', function () {
    let config = {
      config: {
        extends: 'recommended',
      },
    };

    let cloned = JSON.parse(JSON.stringify(config));

    let actual = getProjectConfig(config);

    expect(Object.keys(actual.rules).length).toBeTruthy();
    expect(config).toEqual(cloned);
  });
});

describe('determineRuleConfig', function () {
  it('returns config and severity for a given rule config', function () {
    let config = {
      foo: 'bar',
      bang: 'warn',
      derp: ['warn', [1, 2, 3]],
      biz: ['random', 'data'],
      baz: true,
    };
    expect(determineRuleConfig(config.foo)).toEqual({ config: 'bar', severity: 2 });
    expect(determineRuleConfig(config.bang)).toEqual({ config: true, severity: 1 });
    expect(determineRuleConfig(config.derp)).toEqual({ config: [1, 2, 3], severity: 1 });
    expect(determineRuleConfig(config.biz)).toEqual({ config: ['random', 'data'], severity: 2 });
    expect(determineRuleConfig(config.baz)).toEqual({ config: true, severity: 2 });
  });
});

describe('getConfigForFile', function () {
  it('Merges the overrides rules with existing rules config', function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
      overrides: [
        {
          files: ['**/templates/**/*.hbs'],
          rules: {
            baz: 'bang',
          },
        },
      ],
    };

    let expectedRule = {
      foo: 'bar',
      baz: 'bang',
    };
    let actual = getConfigForFile(config, { filePath: 'app/templates/foo.hbs' });

    expect(actual.rules).toEqual(expectedRule);
  });

  it('Returns the correct rules config if overrides is empty/not present', function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
      overrides: [],
    };

    // clone to ensure we are not mutating
    let expected = JSON.parse(JSON.stringify(config));

    let actual = getConfigForFile(config, 'app/templates/foo.hbs');

    expect(actual.rules).toEqual(expected.rules);

    delete config.overrides;

    actual = getConfigForFile(config, 'app/templates/foo.hbs');

    expect(actual.rules).toEqual(expected.rules);
  });

  it('Merges the overrides rules from multiple overrides with existing rules config', function () {
    let config = {
      rules: {
        qux: 'blobber',
        foo: 'bar',
        baz: 'derp',
      },
      overrides: [
        {
          files: ['**/templates/**/*.hbs'],
          rules: {
            baz: 'bang',
          },
        },
        {
          files: ['**/foo.hbs'],
          rules: {
            foo: 'zomg',
          },
        },
      ],
    };

    let expectedRule = {
      qux: 'blobber',
      foo: 'zomg',
      baz: 'bang',
    };
    let actual = getConfigForFile(config, { filePath: 'app/templates/foo.hbs' });

    expect(actual.rules).toEqual(expectedRule);
  });

  it('returns the correct pendingStatus when the provided moduleId is listed in `pending`', function () {
    let config = {
      pending: ['some/path/here', { moduleId: 'foo/bar/baz', only: ['no-bare-strings'] }],
    };

    expect(getConfigForFile(config, { moduleId: 'some/path/here' }).pendingStatus).toBeTruthy();
    expect(getConfigForFile(config, { moduleId: 'foo/bar/baz' }).pendingStatus).toBeTruthy();
    expect(getConfigForFile(config, { moduleId: 'some/other/path' }).pendingStatus).toBeFalsy();
  });

  it('matches with absolute paths for modules', function () {
    let config = {
      pending: ['some/path/here', { moduleId: 'foo/bar/baz', only: ['no-bare-strings'] }],
    };
    expect(
      getConfigForFile(config, { moduleId: `${process.cwd()}/some/path/here` }).pendingStatus
    ).toBeTruthy();
    expect(
      getConfigForFile(config, { moduleId: `${process.cwd()}/foo/bar/baz` }).pendingStatus
    ).toBeTruthy();
  });

  it('should return an empty object when options.config is set explicitly false', function () {
    const config = resolveProjectConfig({ config: false });

    expect(config).toEqual({});
  });

  it('should be able to translate rule:severity to an object', function () {
    expect(getRuleFromString('no-implicit-this:error')).toEqual({
      name: 'no-implicit-this',
      config: {
        severity: 2,
        config: true,
      },
    });
    expect(getRuleFromString('no-implicit-this:warn')).toEqual({
      name: 'no-implicit-this',
      config: {
        severity: 1,
        config: true,
      },
    });
    expect(getRuleFromString('no-implicit-this:off')).toEqual({
      name: 'no-implicit-this',
      config: {
        severity: 0,
        config: false,
      },
    });
  });

  it('should be able to translate rule:["severity", { configObject }] to an object', function () {
    expect(getRuleFromString('no-implicit-this:["error", { "allow": ["some-helper"] }]')).toEqual({
      name: 'no-implicit-this',
      config: { severity: 2, config: { allow: ['some-helper'] } },
    });
    expect(getRuleFromString('no-implicit-this:["warn", { "allow": ["some-helper"] }]')).toEqual({
      name: 'no-implicit-this',
      config: { severity: 1, config: { allow: ['some-helper'] } },
    });
    expect(getRuleFromString('no-implicit-this:["off", { "allow": ["some-helper"] }]')).toEqual({
      name: 'no-implicit-this',
      config: { severity: 0, config: { allow: ['some-helper'] } },
    });

    try {
      expect(getRuleFromString('no-implicit-this:["error", "allow": ["some-helper"] }]')).toEqual({
        name: 'no-implicit-this',
        config: { severity: 2, config: { allow: ['some-helper'] } },
      });
    } catch (error) {
      expect(error.message).toEqual(
        'Error parsing specified `--rule` config no-implicit-this:["error", "allow": ["some-helper"] }] as JSON.'
      );
    }
  });

  it('processing config is idempotent', function () {
    let config = {
      plugins: [
        {
          name: 'foo',
          configurations: {
            recommended: {
              rules: {
                foo: true,
              },
            },
          },
          rules: {
            foo: class Rule {},
          },
        },
      ],
      extends: ['foo:recommended'],
      rules: {
        bar: false,
      },
    };

    let expected = {
      foo: { config: true, severity: 2 },
      bar: { config: false, severity: 0 },
    };

    let processedConfig = getProjectConfig({ config });
    expect(processedConfig.rules).toEqual(expected);

    let reprocessedConfig = getProjectConfig({ config });
    expect(reprocessedConfig.rules).toEqual(expected);
  });
});

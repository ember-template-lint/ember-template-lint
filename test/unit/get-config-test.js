// TODO: This test file is temporarily disabled in Node versions before 16 (see ci.yml).

import { stripIndent } from 'common-tags';
import { join } from 'node:path';

import recommendedConfig from '../../lib/config/recommended.js';
import { getProjectConfig, resolveProjectConfig, getRuleFromString } from '../../lib/get-config.js';
import determineRuleConfig from '../../lib/helpers/determine-rule-config.js';
import buildFakeConsole from '../helpers/console.js';
import Project from '../helpers/fake-project.js';

describe('get-config', function () {
  let project = null;

  beforeEach(async function () {
    project = new Project();
    await project.write();
  });

  afterEach(function () {
    project.dispose();
  });

  it('if config is provided directly, it is used', async function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };

    let actual = await getProjectConfig(project.baseDir, { config });
    expect(actual.rules).toEqual({
      foo: { config: 'bar', severity: 2 },
      baz: { config: 'derp', severity: 2 },
    });
  });

  it('supports severity level', async function () {
    let expected = {
      rules: {
        foo: { config: true, severity: 1 },
        baz: { config: 'derp', severity: 2 },
      },
    };

    let actual = await getProjectConfig(project.baseDir, {
      config: {
        rules: {
          foo: 'warn',
          baz: 'derp',
        },
      },
    });
    expect(actual.rules).toEqual(expected.rules);
  });

  it('shows rules being "upgraded" to the new syntax when the config is in the old syntax', async function () {
    let actual = await getProjectConfig(project.baseDir, {
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

  it('supports severity level with custom configuration', async function () {
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

    let actual = await getProjectConfig(project.baseDir, {
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

  it('uses .template-lintrc.js in cwd if present', async function () {
    let config = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };
    // clone to ensure we are not mutating
    let expected = JSON.parse(JSON.stringify(config));

    await project.setConfig(expected);
    project.chdir();

    let actual = await getProjectConfig(project.baseDir, {});

    expect(actual.rules).toEqual({
      foo: { config: 'bar', severity: 2 },
      baz: { config: 'derp', severity: 2 },
    });
  });

  it('uses the specified configPath from cwd', async function () {
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

    let actual = await getProjectConfig(project.baseDir, { configPath: 'some-other-path.js' });

    expect(actual.rules).toEqual({
      foo: { config: 'bar', severity: 2 },
      baz: { config: 'derp', severity: 2 },
    });
  });

  it('uses the specified configPath outside of cwd', async function () {
    let someOtherPathConfig = {
      rules: {
        foo: 'bar',
        baz: 'derp',
      },
    };
    project.files['some-other-path.js'] = `module.exports = ${JSON.stringify(
      someOtherPathConfig
    )};`;
    await project.write();

    let actual = await getProjectConfig(project.baseDir, {
      configPath: project.path('some-other-path.js'),
    });

    expect(actual.rules).toEqual({
      foo: { config: 'bar', severity: 2 },
      baz: { config: 'derp', severity: 2 },
    });
  });

  it('can specify that it extends a default configuration', async function () {
    let actual = await getProjectConfig(project.baseDir, {
      config: {
        extends: 'recommended',
      },
    });

    expect(actual.rules['no-debugger']).toEqual({ config: true, severity: 2 });
    expect(actual.overrides[0]?.files).toEqual(['**/*.gjs', '**/*.gts']);
  });

  it('can extend and override a default configuration', async function () {
    let expected = recommendedConfig;

    let actual = await getProjectConfig(project.baseDir, {
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

  it('throws when specifying unknown properties in the config root', async function () {
    await expect(
      async () =>
        await getProjectConfig(project.baseDir, {
          config: {
            foo: false,
          },
        })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Unknown top-level configuration property detected: foo"`
    );
  });

  it('returns empty format object when no config.format is provided', async function () {
    let actual = await getProjectConfig(project.baseDir, {
      config: {},
    });

    expect(actual.format).toEqual({});
  });

  it('throws when invalid format property in config.format is provided', async function () {
    await expect(
      async () =>
        await getProjectConfig(project.baseDir, {
          config: {
            format: {
              formatters: [
                {
                  name: 'pretty',
                  foo: 'bar',
                },
              ],
            },
          },
        })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"An invalid \`format.formatter\` in \`.template-lintrc.js\` was provided. Unexpected property \`foo\`"`
    );
  });

  it('throws when providing wrong type for config.extends', async function () {
    await expect(
      async () =>
        await getProjectConfig(project.baseDir, {
          config: {
            extends: 123,
          },
        })
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"config.extends should be string or array"`);
  });

  it('warns for unknown rules', async function () {
    let console = buildFakeConsole();

    await getProjectConfig(project.baseDir, {
      console,
      config: {
        rules: {
          blammo: true,
        },
      },
    });

    expect(console.stdout).toMatch(/Invalid rule configuration found/);
  });

  it('throws for unknown extends', async function () {
    await expect(
      async () =>
        await getProjectConfig(project.baseDir, {
          config: {
            extends: ['recommended', 'plugin1:wrong-extend'],
          },
        })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Cannot find configuration for extends: plugin1:wrong-extend"`
    );
  });

  it('resolves plugins by string', async function () {
    let console = buildFakeConsole();

    await project.setConfig({
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

    let actual = await getProjectConfig(project.baseDir, {
      console,
    });

    expect(console.stdout).toEqual('');
    expect(actual.rules['quotes']).toEqual({ config: 'single', severity: 2 });
  });

  it('resolves plugins by string when using specified config (not resolved project config)', async function () {
    let console = buildFakeConsole();

    await project.setConfig();

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

    let actual = await getProjectConfig(project.baseDir, {
      console,
      config: {
        extends: ['my-awesome-thing:stylistic'],
        plugins: ['my-awesome-thing'],
      },
    });

    expect(console.stdout).toEqual('');
    expect(actual.rules['quotes']).toEqual({ config: 'single', severity: 2 });
  });

  it('throws when inline plugin is missing name', async function () {
    await expect(
      async () =>
        await getProjectConfig(project.baseDir, {
          config: { plugins: [{}] },
        })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Inline plugin object has not defined the plugin \`name\` property"`
    );
  });

  it('throws when inline plugin is wrong type', async function () {
    await expect(
      async () =>
        await getProjectConfig(project.baseDir, {
          config: { plugins: [123] },
        })
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Inline plugin is not a plain object"`);
  });

  it('throws when non-inline plugin is missing name', async function () {
    await project.setConfig();

    project.addDevDependency('my-awesome-thing', '0.0.0', (dep) => {
      dep.files['index.js'] = 'module.exports = {};';
    });

    project.chdir();

    await expect(
      async () =>
        await getProjectConfig(project.baseDir, {
          console,
          config: {
            extends: ['my-awesome-thing:stylistic'],
            plugins: ['my-awesome-thing'],
          },
        })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Plugin (my-awesome-thing) has not defined the plugin \`name\` property"`
    );
  });

  it('throws when non-inline plugin is wrong type', async function () {
    await project.setConfig();

    project.addDevDependency('my-awesome-thing', '0.0.0', (dep) => {
      dep.files['index.js'] = 'module.exports = 123;';
    });

    project.chdir();

    await expect(
      async () =>
        await getProjectConfig(project.baseDir, {
          console,
          config: {
            extends: ['my-awesome-thing:stylistic'],
            plugins: ['my-awesome-thing'],
          },
        })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Plugin (my-awesome-thing) did not return a plain object"`
    );
  });

  it('extending multiple configurations allows subsequent configs to override earlier ones', async function () {
    let actual = await getProjectConfig(project.baseDir, {
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

  it('extending multiple configurations merges all rules', async function () {
    let actual = await getProjectConfig(project.baseDir, {
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

  it('can specify plugin without rules', async function () {
    let console = buildFakeConsole();

    let actual = await getProjectConfig(project.baseDir, {
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

  it('throw exception when plugin path is incorrect', async function () {
    let wrongPluginPath = './bad-plugin-path/incorrect-file-name';

    await expect(
      async () =>
        await getProjectConfig(project.baseDir, {
          config: {
            plugins: [wrongPluginPath],
          },
        })
    ).rejects.toThrow();
  });

  it('validates non-default loaded rules', async function () {
    let console = buildFakeConsole();

    let actual = await getProjectConfig(project.baseDir, {
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

  it('can chain extends and load rules across chained plugins', async function () {
    let console = buildFakeConsole();

    let actual = await getProjectConfig(project.baseDir, {
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

  it('handles circular reference in config', async function () {
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
    let actual = await getProjectConfig(project.baseDir, {
      console,
      config,
    });

    expect(console.stdout).toBeFalsy();
    expect(actual.rules['foo-bar']).toEqual({ config: true, severity: 2 });
  });

  it('handles circular reference in plugin', async function () {
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
    let actual = await getProjectConfig(project.baseDir, {
      console,

      config: {
        extends: 'plugin1:recommended',

        plugins: [plugin],
      },
    });

    expect(console.stdout).toBeFalsy();
    expect(actual.rules['foo-bar']).toEqual({ config: true, severity: 2 });
  });

  it('getting config is idempotent', async function () {
    let console = buildFakeConsole();
    let firstPass = await getProjectConfig(project.baseDir, {
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
    let secondPass = await getProjectConfig(project.baseDir, {
      console,
      config: firstPass,
    });
    let secondPassJSON = JSON.stringify(secondPass);

    expect(firstPassJSON).toEqual(secondPassJSON);
    expect(console.stdout).toBeFalsy();
  });

  it('does not mutate the config', async function () {
    let config = {
      config: {
        extends: 'recommended',
      },
    };

    let cloned = JSON.parse(JSON.stringify(config));

    let actual = await getProjectConfig(project.baseDir, config);

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

describe('resolveProjectConfig', function () {
  it('should return an empty object when options.configPath is set explicitly false', async function () {
    let project = new Project();
    await project.write();

    try {
      const config = await resolveProjectConfig(project.baseDir, { configPath: false });

      expect(config).toEqual({});
    } finally {
      project.dispose();
    }
  });

  it('should search for config from sub to parent directory', async function () {
    let project = await Project.defaultSetup();

    project.write({
      top: {
        bottom: {},
      },
    });

    try {
      const config = await resolveProjectConfig(join(project.baseDir, 'top', 'bottom'), {});

      expect(config).toEqual({
        extends: 'recommended',
      });
    } finally {
      project.dispose();
    }
  });

  it('should search for config from sub to middle directory', async function () {
    let project = await Project.defaultSetup();

    project.write({
      top: {
        bottom: {},
        '.template-lintrc.js': `
'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-bare-strings': 'off'
  }
};
`,
      },
    });

    try {
      const config = await resolveProjectConfig(join(project.baseDir, 'top', 'bottom'), {});

      expect(config).toEqual({
        extends: 'recommended',
        rules: {
          'no-bare-strings': 'off',
        },
      });
    } finally {
      project.dispose();
    }
  });

  it('should search for config relative to the specified working directory', async function () {
    let project1 = new Project();
    await project1.write();
    let project2 = new Project();
    await project2.write();

    await project1.chdir();

    await project2.setConfig({
      extends: 'foo',
    });

    try {
      const config = await resolveProjectConfig(project2.baseDir, {});

      expect(config).toEqual({
        extends: 'foo',
      });
    } finally {
      project1.dispose();
      project2.dispose();
    }
  });
});

describe('getProjectConfig', function () {
  let project = null;

  beforeEach(async function () {
    project = new Project();
    await project.write();
  });

  afterEach(function () {
    project.dispose();
  });

  it('processing config is idempotent', async function () {
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

    let processedConfig = await getProjectConfig(project.baseDir, { config });
    expect(processedConfig.rules).toEqual(expected);

    let reprocessedConfig = await getProjectConfig(project.baseDir, { config });
    expect(reprocessedConfig.rules).toEqual(expected);
  });

  it('merges rules from plugins with rules from config', async function () {
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
        foo: false,
      },
    };

    let expected = {
      foo: { config: false, severity: 0 },
    };

    let processedConfig = await getProjectConfig(project.baseDir, { config });
    expect(processedConfig.rules).toEqual(expected);
  });

  it('merges rules from plugins in the order declared in the array', async function () {
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
        {
          name: 'bar',
          configurations: {
            recommended: {
              rules: {
                foo: false,
              },
            },
          },
          rules: {
            foo: class Rule {},
          },
        },
      ],
      extends: ['foo:recommended', 'bar:recommended'],
    };

    let expected = {
      foo: { config: false, severity: 0 },
    };

    let processedConfig = await getProjectConfig(project.baseDir, { config });
    expect(processedConfig.rules).toEqual(expected);
  });
});

describe('getRuleFromString', function () {
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
});

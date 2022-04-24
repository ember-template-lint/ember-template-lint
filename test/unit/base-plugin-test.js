import { parse, transform } from 'ember-template-recast';
import { readdirSync } from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import exportedPresets from '../../lib/config/index.js';
import EditorConfigResolver from '../../lib/get-editor-config.js';
import determineRuleConfig from '../../lib/helpers/determine-rule-config.js';
import { ConfigDefaults } from '../../lib/helpers/rule-test-harness.js';
import Rule from '../../lib/rules/_base.js';
import rules from '../../lib/rules/index.js';
import { setupProject, teardownProject } from '../helpers/bin-tester.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ruleNames = Object.keys(rules);

describe('base plugin', function () {
  let project, editorConfigResolver;
  beforeEach(async () => {
    project = await setupProject();

    editorConfigResolver = new EditorConfigResolver(project.baseDir);
    editorConfigResolver.resolveEditorConfigFiles();
  });

  afterEach(() => {
    teardownProject();
  });

  async function runRules(template, rules) {
    let ast = parse(template);

    for (let ruleConfig of rules) {
      let { Rule } = ruleConfig;

      let options = Object.assign(
        {},
        {
          filePath: ConfigDefaults.filePath,

          rawSource: template,
          workingDir: ConfigDefaults.workingDir,
          ruleNames,
        },
        ruleConfig
      );

      options.configResolver = Object.assign({}, ruleConfig.configResolver, {
        editorConfig: () => {
          if (!options.filePath) {
            return {};
          }

          return editorConfigResolver.getEditorConfigData(options.filePath);
        },
      });

      let rule = new Rule(options);
      let visitor = await rule.getVisitor();
      transform(ast, () => visitor);
    }
  }

  let messages, config;
  beforeEach(function () {
    messages = [];
    config = {};
  });

  function buildPlugin(visitor) {
    class FakeRule extends Rule {
      log(result) {
        messages.push(result.source);
      }

      process(node) {
        this.log({
          message: 'Node source',
          node,
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
        });
      }

      visitor() {
        return visitor;
      }
    }

    return FakeRule;
  }

  function plugin(Rule, name, config) {
    return { Rule, name, config };
  }

  it('all presets correctly reexported', function () {
    const presetsPath = path.join(__dirname, '../../lib/config');

    const files = readdirSync(presetsPath);
    const presetFiles = files
      .map((it) => path.parse(it))
      .filter((it) => it.ext === '.js' && it.name !== 'index')
      .map((it) => it.name);

    const exportedPresetNames = Object.keys(exportedPresets);

    expect(exportedPresetNames).toEqual(presetFiles);
  });

  describe('rule APIs', function () {
    it('can access filePath', async function () {
      class AwesomeRule extends Rule {
        visitor() {
          expect(this.filePath).toBe('foo.hbs');
        }
      }

      await runRules('foo', [
        {
          Rule: AwesomeRule,
          name: 'awesome-rule',
          config: true,
          filePath: 'foo.hbs',
        },
      ]);
    });

    it('can access _rawSource', async function () {
      class AwesomeRule extends Rule {
        visitor() {
          expect(this._rawSource).toBe('foo');
        }
      }

      await runRules('foo', [plugin(AwesomeRule, 'awesome-rule', true)]);
    });

    it('can access workingDir', async function () {
      class AwesomeRule extends Rule {
        visitor() {
          expect(this.workingDir).toBe('foo');
        }
      }

      await runRules('foo', [
        {
          Rule: AwesomeRule,
          name: 'awesome-rule',
          config: true,
          workingDir: 'foo',
        },
      ]);
    });

    it('can access editorConfig', async function () {
      class AwesomeRule extends Rule {
        visitor() {
          expect(this.editorConfig.insert_final_newline).toBe(false);
        }
      }

      await runRules('foo', [plugin(AwesomeRule, 'awesome-rule', true)]);
    });

    it('throws when not passing all loc properties when logging a violation', async function () {
      class AwesomeRule extends Rule {
        visitor() {
          this.log({ line: 1, column: 2, message: 'some message' });
        }
      }

      await expect(
        async () => await runRules('foo', [plugin(AwesomeRule, 'awesome-rule', true)])
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"ember-template-lint: (awesome-rule) Must pass the node or all loc properties (line, column, endLine, endColumn) when calling log."`
      );
    });

    it('throws when logging without violation message', async function () {
      class AwesomeRule extends Rule {
        visitor() {
          this.log({ node: {} });
        }
      }

      await expect(
        async () => await runRules('foo', [plugin(AwesomeRule, 'awesome-rule', true)])
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"ember-template-lint: (awesome-rule): must provide violation \`message\` when calling log."`
      );
    });

    it('does not error when accessing editorConfig when no filePath is passed', async function () {
      class AwesomeRule extends Rule {
        visitor() {
          expect(this.editorConfig.insert_final_newline).toBe(undefined);
        }
      }

      await runRules('foo', [
        { Rule: AwesomeRule, name: 'awesome-rule', config: true, filePath: undefined },
      ]);
    });

    it('can access template-recast env', async function () {
      class AwesomeRule extends Rule {
        visitor(env) {
          expect(env).toBe(undefined);
        }
      }

      await runRules('foo', [plugin(AwesomeRule, 'awesome-rule', true)]);
    });
  });

  describe('parses templates', function () {
    let visitor = {
      ElementNode(node) {
        this.process(node);
      },

      TextNode(node) {
        if (!node.loc) {
          return;
        }

        this.process(node);
      },
    };

    function expectSource(config) {
      let template = config.template;
      let nodeSources = config.sources;

      it(`can get raw source for \`${template}\``, async function () {
        await runRules(template, [plugin(buildPlugin(visitor), 'fake', config)]);

        expect(messages).toEqual(nodeSources);
      });
    }

    expectSource({
      template: '<div>Foo</div>',
      sources: ['<div>Foo</div>', 'Foo'],
    });

    expectSource({
      template: '<div>\n  <div data-foo="blerp">\n    Wheee!\n  </div>\n</div>',
      sources: [
        '<div>\n  <div data-foo="blerp">\n    Wheee!\n  </div>\n</div>',
        '\n  ',
        '<div data-foo="blerp">\n    Wheee!\n  </div>',
        'blerp',
        '\n    Wheee!\n  ',
        '\n',
      ],
    });
  });

  describe('node types', function () {
    let wasCalled;

    let visitor = {
      Template() {
        wasCalled = true;
      },
    };

    it('calls the "Template" node type', async function () {
      await runRules('<div>Foo</div>', [plugin(buildPlugin(visitor), 'fake', config)]);

      expect(wasCalled).toBe(true);
    });
  });

  describe('parses instructions', function () {
    async function processTemplate(template) {
      let Rule = buildPlugin({
        MustacheCommentStatement(node) {
          this.process(node);
        },
      });

      Rule.prototype.log = function (result) {
        messages.push(result.message);
      };
      Rule.prototype.process = function (node) {
        config = this._processInstructionNode(node);
      };

      await runRules(template, [plugin(Rule, 'fake', 'foo')]);
    }

    function expectConfig(instruction, expectedConfig) {
      it(`can parse \`${instruction}\``, async function () {
        await processTemplate(`{{! ${instruction} }}`);
        expect(config).toEqual(expectedConfig);
        expect(messages).toEqual([]);
      });
    }

    // Global enable/disable
    expectConfig('template-lint-disable', { value: false, tree: false });
    expectConfig('template-lint-disable-tree', { value: false, tree: true });
    expectConfig('template-lint-enable', { value: 'foo', tree: false });
    expectConfig('template-lint-enable-tree', { value: 'foo', tree: true });
    expectConfig('  template-lint-enable-tree ', { value: 'foo', tree: true });

    // Specific enable/disable
    expectConfig('template-lint-disable fake', { value: false, tree: false });
    expectConfig('template-lint-disable-tree "fake"', { value: false, tree: true });
    expectConfig("template-lint-disable fake 'no-bare-strings'", { value: false, tree: false });
    expectConfig('template-lint-disable no-bare-strings fake block-indentation', {
      value: false,
      tree: false,
    });
    expectConfig('template-lint-disable no-bare-strings', null);
    expectConfig(' template-lint-disable   fake ', { value: false, tree: false });
    expectConfig('template-lint-disable   no-bare-strings    fake   block-indentation ', {
      value: false,
      tree: false,
    });

    // Configure
    expectConfig('template-lint-configure fake { "key1": "value", "key2": { "key3": 1 } }', {
      value: { key1: 'value', key2: { key3: 1 } },
      tree: false,
    });
    expectConfig('template-lint-configure-tree "fake" { "key": "value" }', {
      value: { key: 'value' },
      tree: true,
    });
    expectConfig("template-lint-configure-tree 'fake' true", {
      value: true,
      tree: true,
    });
    expectConfig('template-lint-configure-tree fake false', {
      value: false,
      tree: true,
    });
    expectConfig('template-lint-configure-tree no-bare-strings { "key": "value" }', null);
    expectConfig('  template-lint-configure-tree    fake   { "key": "value" }', {
      value: { key: 'value' },
      tree: true,
    });

    // Not config
    expectConfig('this code is awesome', null);
    expectConfig('', null);

    // Errors
    it('logs an error when it encounters an unknown rule name', async function () {
      await processTemplate(
        [
          '{{! template-lint-enable notarule }}',
          '{{! template-lint-disable fake norme meneither }}',
          '{{! template-lint-configure nope false }}',
        ].join('\n')
      );
      expect(messages).toEqual([
        'unrecognized rule name `notarule` in template-lint-enable instruction',
        'unrecognized rule name `norme` in template-lint-disable instruction',
        'unrecognized rule name `meneither` in template-lint-disable instruction',
        'unrecognized rule name `nope` in template-lint-configure instruction',
      ]);
    });

    it("logs an error when it can't parse a configure instruction's JSON", async function () {
      await processTemplate('{{! template-lint-configure fake { not: "json" ] }}');
      expect(messages).toEqual([
        'malformed template-lint-configure instruction: `{ not: "json" ]` is not valid JSON',
      ]);
    });

    it('logs an error when it encounters an unrecognized instruction starting with `template-lint`', async function () {
      await processTemplate(
        [
          '{{! template-lint-bloober fake }}',
          '{{! template-lint- fake }}',
          '{{! template-lint fake }}',
        ].join('\n')
      );
      expect(messages).toEqual([
        'unrecognized template-lint instruction: `template-lint-bloober`',
        'unrecognized template-lint instruction: `template-lint-`',
        'unrecognized template-lint instruction: `template-lint`',
      ]);
    });

    it('only logs syntax errors once across all rules', async function () {
      await runRules(
        '{{! template-lint-enable notarule }}{{! template-lint-disable meneither }}{{! template-lint-configure norme true }}',
        [
          plugin(buildPlugin({}), 'fake1'),
          plugin(buildPlugin({}), 'fake2'),
          plugin(buildPlugin({}), 'fake3'),
          plugin(buildPlugin({}), 'fake4'),
          plugin(buildPlugin({}), 'fake5'),
        ]
      );
      expect(messages).toHaveLength(3);
    });

    describe('allowInlineConfig: false', function () {
      async function processTemplate(template) {
        let Rule = buildPlugin({
          MustacheCommentStatement(node) {
            this.process(node);
          },
        });

        Rule.prototype.log = function (result) {
          messages.push(result.message);
        };
        Rule.prototype.process = function (node) {
          config = this._processInstructionNode(node);
        };

        await runRules(template, [
          Object.assign({ allowInlineConfig: false }, plugin(Rule, 'fake', 'foo')),
        ]);
      }

      it('inline config has no effect', async function () {
        await processTemplate('{{! template-lint-disable fake }}');

        expect(config).toEqual(null);
      });

      it('unknown rules do not throw an error', async function () {
        await processTemplate(
          [
            '{{! template-lint-enable notarule }}',
            '{{! template-lint-disable fake norme meneither }}',
            '{{! template-lint-configure nope false }}',
          ].join('\n')
        );
        expect(messages).toEqual([]);
      });
    });
  });

  describe('scopes instructions', function () {
    let events;

    function getId(node) {
      if (node.attributes) {
        for (let i = 0; i < node.attributes.length; i++) {
          if (node.attributes[i].name === 'id') {
            return node.attributes[i].value.chars;
          }
        }
      }
      return '';
    }

    function addEvent(event, node, plugin) {
      let { config, severity } = determineRuleConfig(plugin.config);
      events.push([event, getId(node), config, severity]);
    }

    function buildPlugin() {
      class FakeRule extends Rule {
        log(result) {
          messages.push(result.source);
        }

        visitor() {
          let pluginContext = this; // eslint-disable-line unicorn/no-this-assignment

          return {
            ElementNode: {
              enter(node) {
                addEvent('element/enter', node, pluginContext);
              },
              exit(node) {
                addEvent('element/exit', node, pluginContext);
              },
              keys: {
                children: {
                  enter(node) {
                    addEvent('element/enter:children', node, pluginContext);
                  },
                  exit(node) {
                    addEvent('element/exit:children', node, pluginContext);
                  },
                },
              },
            },
            MustacheCommentStatement: {
              enter(node) {
                addEvent('comment/enter', node, pluginContext);
              },
              exit(node) {
                addEvent('comment/exit', node, pluginContext);
              },
            },
          };
        }
      }

      return FakeRule;
    }

    async function processTemplate(template, config) {
      if (config === undefined) {
        config = true;
      }

      await runRules(template, [plugin(buildPlugin(), 'fake', config)]);
    }

    beforeEach(function () {
      messages = [];
      events = [];
    });

    function expectEvents(data) {
      let description = data.desc;
      let template = data.template;
      let expectedEvents = data.events;
      let config = data.config;

      it(description, async function () {
        await processTemplate(template, config);
        expect(events).toEqual(expectedEvents);
        expect(messages).toEqual([]);
      });
    }

    expectEvents({
      desc: 'handles top-level instructions',
      template: ['{{! template-lint-configure fake "foo" }}', '<div id="id1"></div>'].join('\n'),
      events: [
        ['comment/enter', '', true, 2],
        ['comment/exit', '', 'foo', 2],
        ['element/enter', 'id1', 'foo', 2],
        ['element/enter:children', 'id1', 'foo', 2],
        ['element/exit:children', 'id1', 'foo', 2],
        ['element/exit', 'id1', 'foo', 2],
      ],
    });

    expectEvents({
      desc: 'uses config correctly with custom severity',
      template: [
        '<div id="id1">',
        '  {{! template-lint-configure fake "off" }}',
        '  <span id="id2">',
        '    {{! template-lint-configure fake ["warn", ["bar", "baz"]] }}',
        '    <b id="id3"/>',
        '  </span>',
        '</div>',
        '<i id="id4"></i>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', true, 2],
        ['element/enter:children', 'id1', true, 2],
        ['comment/enter', '', true, 2],
        ['comment/exit', '', false, 0],
        ['element/enter', 'id2', false, 0],
        ['element/enter:children', 'id2', false, 0],
        ['comment/enter', '', false, 0],
        ['comment/exit', '', ['bar', 'baz'], 1],
        ['element/enter', 'id3', ['bar', 'baz'], 1],
        ['element/enter:children', 'id3', ['bar', 'baz'], 1],
        ['element/exit:children', 'id3', ['bar', 'baz'], 1],
        ['element/exit', 'id3', ['bar', 'baz'], 1],
        ['element/exit:children', 'id2', false, 0],
        ['element/exit', 'id2', false, 0],
        ['element/exit:children', 'id1', true, 2],
        ['element/exit', 'id1', true, 2],
        ['element/enter', 'id4', true, 2],
        ['element/enter:children', 'id4', true, 2],
        ['element/exit:children', 'id4', true, 2],
        ['element/exit', 'id4', true, 2],
      ],
    });

    expectEvents({
      desc: 'handles element-child instructions',
      template: [
        '<div id="id1">',
        '  {{! template-lint-configure fake "foo" }}',
        '  <span id="id2"></span>',
        '</div>',
        '<i id="id3"></i>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', true, 2],
        ['element/enter:children', 'id1', true, 2],
        ['comment/enter', '', true, 2],
        ['comment/exit', '', 'foo', 2],
        ['element/enter', 'id2', 'foo', 2],
        ['element/enter:children', 'id2', 'foo', 2],
        ['element/exit:children', 'id2', 'foo', 2],
        ['element/exit', 'id2', 'foo', 2],
        ['element/exit:children', 'id1', true, 2],
        ['element/exit', 'id1', true, 2],
        ['element/enter', 'id3', true, 2],
        ['element/enter:children', 'id3', true, 2],
        ['element/exit:children', 'id3', true, 2],
        ['element/exit', 'id3', true, 2],
      ],
    });

    expectEvents({
      desc: 'handles niece/nephew instructions',
      template: [
        '<div id="id1">',
        '  {{! template-lint-configure fake "foo" }}',
        '  <span id="id2">',
        '    {{! template-lint-configure fake "bar" }}',
        '    <b id="id3"/>',
        '  </span>',
        '</div>',
        '<i id="id4"></i>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', true, 2],
        ['element/enter:children', 'id1', true, 2],
        ['comment/enter', '', true, 2],
        ['comment/exit', '', 'foo', 2],
        ['element/enter', 'id2', 'foo', 2],
        ['element/enter:children', 'id2', 'foo', 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'bar', 2],
        ['element/enter', 'id3', 'bar', 2],
        ['element/enter:children', 'id3', 'bar', 2],
        ['element/exit:children', 'id3', 'bar', 2],
        ['element/exit', 'id3', 'bar', 2],
        ['element/exit:children', 'id2', 'foo', 2],
        ['element/exit', 'id2', 'foo', 2],
        ['element/exit:children', 'id1', true, 2],
        ['element/exit', 'id1', true, 2],
        ['element/enter', 'id4', true, 2],
        ['element/enter:children', 'id4', true, 2],
        ['element/exit:children', 'id4', true, 2],
        ['element/exit', 'id4', true, 2],
      ],
    });

    expectEvents({
      desc: 'handles sibling instructions',
      template: [
        '<div id="id1">',
        '  {{! template-lint-configure fake "foo" }}',
        '  <span id="id2"/>',
        '  {{! template-lint-configure fake "bar" }}',
        '  <b id="id3"/>',
        '</div>',
        '<i id="id4"></i>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', true, 2],
        ['element/enter:children', 'id1', true, 2],
        ['comment/enter', '', true, 2],
        ['comment/exit', '', 'foo', 2],
        ['element/enter', 'id2', 'foo', 2],
        ['element/enter:children', 'id2', 'foo', 2],
        ['element/exit:children', 'id2', 'foo', 2],
        ['element/exit', 'id2', 'foo', 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'bar', 2],
        ['element/enter', 'id3', 'bar', 2],
        ['element/enter:children', 'id3', 'bar', 2],
        ['element/exit:children', 'id3', 'bar', 2],
        ['element/exit', 'id3', 'bar', 2],
        ['element/exit:children', 'id1', true, 2],
        ['element/exit', 'id1', true, 2],
        ['element/enter', 'id4', true, 2],
        ['element/enter:children', 'id4', true, 2],
        ['element/exit:children', 'id4', true, 2],
        ['element/exit', 'id4', true, 2],
      ],
    });

    expectEvents({
      desc: 'handles in-element instructions',
      template: [
        '<div id="id1">',
        '  <span id="id2" {{! template-lint-configure fake "foo" }}>',
        '    <i id="id3">',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', true, 2],
        ['element/enter:children', 'id1', true, 2],
        ['element/enter', 'id2', 'foo', 2],
        ['element/enter:children', 'id2', true, 2],
        ['element/enter', 'id3', true, 2],
        ['element/enter:children', 'id3', true, 2],
        ['element/enter', 'id4', true, 2],
        ['element/enter:children', 'id4', true, 2],
        ['element/exit:children', 'id4', true, 2],
        ['element/exit', 'id4', true, 2],
        ['element/exit:children', 'id3', true, 2],
        ['element/exit', 'id3', true, 2],
        ['element/exit:children', 'id2', true, 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'foo', 2],
        ['element/exit', 'id2', 'foo', 2],
        ['element/exit:children', 'id1', true, 2],
        ['element/exit', 'id1', true, 2],
      ],
    });

    expectEvents({
      desc: 'handles in-element tree instructions',
      template: [
        '<div id="id1">',
        '  <span id="id2" {{! template-lint-configure-tree fake "foo" }}>',
        '    <i id="id3">',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', true, 2],
        ['element/enter:children', 'id1', true, 2],
        ['element/enter', 'id2', 'foo', 2],
        ['element/enter:children', 'id2', 'foo', 2],
        ['element/enter', 'id3', 'foo', 2],
        ['element/enter:children', 'id3', 'foo', 2],
        ['element/enter', 'id4', 'foo', 2],
        ['element/enter:children', 'id4', 'foo', 2],
        ['element/exit:children', 'id4', 'foo', 2],
        ['element/exit', 'id4', 'foo', 2],
        ['element/exit:children', 'id3', 'foo', 2],
        ['element/exit', 'id3', 'foo', 2],
        ['element/exit:children', 'id2', 'foo', 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'foo', 2],
        ['element/exit', 'id2', 'foo', 2],
        ['element/exit:children', 'id1', true, 2],
        ['element/exit', 'id1', true, 2],
      ],
    });

    expectEvents({
      desc: 'handles in-element instruction in descendant of in-element tree instruction',
      template: [
        '<div id="id1" {{! template-lint-configure-tree fake "foo" }}>',
        '  <span id="id2">',
        '    <i id="id3" {{! template-lint-configure fake "bar" }}>',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', 'foo', 2],
        ['element/enter:children', 'id1', 'foo', 2],
        ['element/enter', 'id2', 'foo', 2],
        ['element/enter:children', 'id2', 'foo', 2],
        ['element/enter', 'id3', 'bar', 2],
        ['element/enter:children', 'id3', 'foo', 2],
        ['element/enter', 'id4', 'foo', 2],
        ['element/enter:children', 'id4', 'foo', 2],
        ['element/exit:children', 'id4', 'foo', 2],
        ['element/exit', 'id4', 'foo', 2],
        ['element/exit:children', 'id3', 'foo', 2],
        ['comment/enter', '', 'bar', 2],
        ['comment/exit', '', 'bar', 2],
        ['element/exit', 'id3', 'bar', 2],
        ['element/exit:children', 'id2', 'foo', 2],
        ['element/exit', 'id2', 'foo', 2],
        ['element/exit:children', 'id1', 'foo', 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'foo', 2],
        ['element/exit', 'id1', 'foo', 2],
      ],
    });

    expectEvents({
      desc: 'handles in-element tree instruction in descendant of in-element tree instruction',
      template: [
        '<div id="id1" {{! template-lint-configure-tree fake "foo" }}>',
        '  <span id="id2">',
        '    <i id="id3" {{! template-lint-configure-tree fake "bar" }}>',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', 'foo', 2],
        ['element/enter:children', 'id1', 'foo', 2],
        ['element/enter', 'id2', 'foo', 2],
        ['element/enter:children', 'id2', 'foo', 2],
        ['element/enter', 'id3', 'bar', 2],
        ['element/enter:children', 'id3', 'bar', 2],
        ['element/enter', 'id4', 'bar', 2],
        ['element/enter:children', 'id4', 'bar', 2],
        ['element/exit:children', 'id4', 'bar', 2],
        ['element/exit', 'id4', 'bar', 2],
        ['element/exit:children', 'id3', 'bar', 2],
        ['comment/enter', '', 'bar', 2],
        ['comment/exit', '', 'bar', 2],
        ['element/exit', 'id3', 'bar', 2],
        ['element/exit:children', 'id2', 'foo', 2],
        ['element/exit', 'id2', 'foo', 2],
        ['element/exit:children', 'id1', 'foo', 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'foo', 2],
        ['element/exit', 'id1', 'foo', 2],
      ],
    });

    expectEvents({
      desc: 'handles descendant instruction of in-element tree instruction',
      template: [
        '<div id="id1" {{! template-lint-configure-tree fake "foo" }}>',
        '  <span id="id2">',
        '    {{! template-lint-configure fake "bar" }}',
        '    <i id="id3">',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', 'foo', 2],
        ['element/enter:children', 'id1', 'foo', 2],
        ['element/enter', 'id2', 'foo', 2],
        ['element/enter:children', 'id2', 'foo', 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'bar', 2],
        ['element/enter', 'id3', 'bar', 2],
        ['element/enter:children', 'id3', 'bar', 2],
        ['element/enter', 'id4', 'bar', 2],
        ['element/enter:children', 'id4', 'bar', 2],
        ['element/exit:children', 'id4', 'bar', 2],
        ['element/exit', 'id4', 'bar', 2],
        ['element/exit:children', 'id3', 'bar', 2],
        ['element/exit', 'id3', 'bar', 2],
        ['element/exit:children', 'id2', 'foo', 2],
        ['element/exit', 'id2', 'foo', 2],
        ['element/exit:children', 'id1', 'foo', 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'foo', 2],
        ['element/exit', 'id1', 'foo', 2],
      ],
    });

    expectEvents({
      desc: 'enable restores default config',
      config: 'foo',
      template: [
        '<div id="id1">',
        '  {{! template-lint-configure fake "bar" }}',
        '  <span id="id2">',
        '    {{! template-lint-disable fake }}',
        '    <i id="id3">',
        '      {{! template-lint-enable fake }}',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', 'foo', 2],
        ['element/enter:children', 'id1', 'foo', 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'bar', 2],
        ['element/enter', 'id2', 'bar', 2],
        ['element/enter:children', 'id2', 'bar', 2],
        ['comment/enter', '', 'bar', 2],
        ['comment/exit', '', 'foo', 2],
        ['element/enter', 'id4', 'foo', 2],
        ['element/enter:children', 'id4', 'foo', 2],
        ['element/exit:children', 'id4', 'foo', 2],
        ['element/exit', 'id4', 'foo', 2],
        ['element/exit:children', 'id2', 'bar', 2],
        ['element/exit', 'id2', 'bar', 2],
        ['element/exit:children', 'id1', 'foo', 2],
        ['element/exit', 'id1', 'foo', 2],
      ],
    });

    expectEvents({
      desc: 'enabling a disabled-by-default rule actually enables it',
      config: false,
      template: [
        '<div id="id1">',
        '  {{! template-lint-enable fake }}',
        '  <span id="id2"></span>',
        '</div>',
      ].join('\n'),
      events: [
        ['comment/exit', '', true, 2],
        ['element/enter', 'id2', true, 2],
        ['element/enter:children', 'id2', true, 2],
        ['element/exit:children', 'id2', true, 2],
        ['element/exit', 'id2', true, 2],
      ],
    });

    // Not really a case that makes sense, but just to be sure it doesn't mess
    // up the config stack
    expectEvents({
      desc: "ensures this pretty silly case doesn't mess up the config stack",
      template: [
        '<div id="id1">',
        '  <span id="id2" {{! template-lint-configure fake "bar" }} {{! template-lint-configure fake "foo" }}>',
        '    <i id="id3">',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', true, 2],
        ['element/enter:children', 'id1', true, 2],
        ['element/enter', 'id2', 'foo', 2],
        ['element/enter:children', 'id2', true, 2],
        ['element/enter', 'id3', true, 2],
        ['element/enter:children', 'id3', true, 2],
        ['element/enter', 'id4', true, 2],
        ['element/enter:children', 'id4', true, 2],
        ['element/exit:children', 'id4', true, 2],
        ['element/exit', 'id4', true, 2],
        ['element/exit:children', 'id3', true, 2],
        ['element/exit', 'id3', true, 2],
        ['element/exit:children', 'id2', true, 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'foo', 2],
        ['comment/enter', '', 'foo', 2],
        ['comment/exit', '', 'foo', 2],
        ['element/exit', 'id2', 'foo', 2],
        ['element/exit:children', 'id1', true, 2],
        ['element/exit', 'id1', true, 2],
      ],
    });

    expectEvents({
      desc: "it doesn't call a disabled rule's visitor handlers",
      template: [
        '<div id="id1">',
        '  <span id="id2" {{! template-lint-disable fake }}>',
        '    <i id="id3">',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>',
      ].join('\n'),
      events: [
        ['element/enter', 'id1', true, 2],
        ['element/enter:children', 'id1', true, 2],
        ['element/enter:children', 'id2', true, 2],
        ['element/enter', 'id3', true, 2],
        ['element/enter:children', 'id3', true, 2],
        ['element/enter', 'id4', true, 2],
        ['element/enter:children', 'id4', true, 2],
        ['element/exit:children', 'id4', true, 2],
        ['element/exit', 'id4', true, 2],
        ['element/exit:children', 'id3', true, 2],
        ['element/exit', 'id3', true, 2],
        ['element/exit:children', 'id2', true, 2],
        ['element/exit:children', 'id1', true, 2],
        ['element/exit', 'id1', true, 2],
      ],
    });
  });
});

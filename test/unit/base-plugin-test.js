'use strict';

const { parse, transform } = require('ember-template-recast');
const Rule = require('./../../lib/rules/base');
const { readdirSync, existsSync, readFileSync } = require('fs');
const { join, parse: parsePath } = require('path');
const ruleNames = Object.keys(require('../../lib/rules'));
const Project = require('../helpers/fake-project');
const EditorConfigResolver = require('../../lib/get-editor-config');

describe('base plugin', function() {
  let project, editorConfigResolver;
  beforeEach(() => {
    project = Project.defaultSetup();

    editorConfigResolver = new EditorConfigResolver();
    editorConfigResolver.resolveEditorConfigFiles();
  });

  afterEach(async () => {
    await project.dispose();
  });

  function runRules(template, rules) {
    let ast = parse(template);

    for (let ruleConfig of rules) {
      let { Rule } = ruleConfig;
      let options = Object.assign({}, ruleConfig, {
        filePath: 'layout.hbs',
        moduleId: 'layout',
        moduleName: 'layout',
        rawSource: template,
        ruleNames,
      });

      options.configResolver = Object.assign({}, ruleConfig.configResolver, {
        editorConfig: () => {
          if (!options.filePath) {
            //return {};
          }

          return editorConfigResolver.getEditorConfigData(options.filePath);
        },
      });

      let rule = new Rule(options);

      transform(ast, () => rule.getVisitor());
    }
  }

  let messages, config;
  beforeEach(function() {
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

  it('all presets correctly reexported', function() {
    const presetsPath = join(__dirname, '../../lib/config');

    const files = readdirSync(presetsPath);
    const presetFiles = files
      .map(it => parsePath(it))
      .filter(it => it.ext === '.js' && it.name !== 'index')
      .map(it => it.name);

    const exportedPresets = require(join(presetsPath, 'index.js'));
    const exportedPresetNames = Object.keys(exportedPresets);

    expect(exportedPresetNames).toEqual(presetFiles);
  });

  describe('rules setup is correct', function() {
    const rulesEntryPath = join(__dirname, '../../lib/rules');
    const files = readdirSync(rulesEntryPath);
    const deprecatedFiles = readdirSync(join(rulesEntryPath, 'deprecations'));
    const deprecatedRules = deprecatedFiles.filter(fileName => {
      return fileName.endsWith('.js');
    });
    const expectedRules = files.filter(fileName => {
      return fileName.endsWith('.js') && !['base.js', 'index.js'].includes(fileName);
    });

    it('has correct rules reexport', function() {
      const defaultExport = require(rulesEntryPath);
      const exportedRules = Object.keys(defaultExport);
      exportedRules.forEach(ruleName => {
        let pathName = join(rulesEntryPath, `${ruleName}`);

        if (ruleName.startsWith('deprecated-')) {
          pathName = join(rulesEntryPath, 'deprecations', `${ruleName}`);
        }

        expect(defaultExport[ruleName]).toEqual(require(pathName));
      });
      expect(expectedRules.length + deprecatedRules.length).toEqual(exportedRules.length);
    });

    it('has docs/rule reference for each item', function() {
      function transformFileName(fileName) {
        return fileName.replace('.js', '.md');
      }
      const ruleDocsFolder = join(__dirname, '../../docs/rule');
      deprecatedFiles.forEach(ruleFileName => {
        const docFilePath = join(ruleDocsFolder, 'deprecations', transformFileName(ruleFileName));
        expect(existsSync(docFilePath)).toBe(true);
      });
      expectedRules.forEach(ruleFileName => {
        const docFilePath = join(ruleDocsFolder, transformFileName(ruleFileName));
        expect(existsSync(docFilePath)).toBe(true);
      });
    });

    it('All files under docs/rule/ have a link from docs/rules.md.', function() {
      const docsPath = join(__dirname, '../../docs');
      const entryPath = join(docsPath, 'rule');
      const ruleFiles = readdirSync(entryPath).filter(
        name => name.endsWith('.md') && name !== '_TEMPLATE_.md'
      );
      const deprecatedRuleFiles = readdirSync(join(entryPath, 'deprecations')).filter(name =>
        name.endsWith('.md')
      );
      const allRulesFile = readFileSync(join(docsPath, 'rules.md'), {
        encoding: 'utf8',
      });
      ruleFiles.forEach(fileName => {
        expect(allRulesFile.includes(`(rule/${fileName})`)).toBe(true);
      });
      deprecatedRuleFiles.forEach(fileName => {
        expect(allRulesFile.includes(`(rule/deprecations/${fileName})`)).toBe(true);
      });
    });

    it('All rules has test files', function() {
      const testsPath = join(__dirname, '../unit/rules');
      const ruleFiles = readdirSync(testsPath).filter(name => name.endsWith('-test.js'));
      const deprecatedRuleFiles = readdirSync(join(testsPath, 'deprecations')).filter(name =>
        name.endsWith('-test.js')
      );
      expectedRules.forEach(ruleFileName => {
        const ruleTestFileName = ruleFileName.replace('.js', '-test.js');
        expect(ruleFiles.includes(ruleTestFileName)).toBe(true);
      });
      deprecatedRules.forEach(ruleFileName => {
        const ruleTestFileName = ruleFileName.replace('.js', '-test.js');
        expect(deprecatedRuleFiles.includes(ruleTestFileName)).toBe(true);
      });
    });
  });

  describe('parses templates', function() {
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

      it(`can get raw source for \`${template}\``, function() {
        runRules(template, [plugin(buildPlugin(visitor), 'fake', config)]);

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

  describe('node types', function() {
    let wasCalled;

    let visitor = {
      Template() {
        wasCalled = true;
      },
    };

    it('calls the "Template" node type', function() {
      runRules('<div>Foo</div>', [plugin(buildPlugin(visitor), 'fake', config)]);

      expect(wasCalled).toBe(true);
    });
  });

  describe('parses instructions', function() {
    function processTemplate(template) {
      let Rule = buildPlugin({
        MustacheCommentStatement(node) {
          this.process(node);
        },
      });

      Rule.prototype.log = function(result) {
        messages.push(result.message);
      };
      Rule.prototype.process = function(node) {
        config = this._processInstructionNode(node);
      };

      runRules(template, [plugin(Rule, 'fake', 'foo')]);
    }

    function expectConfig(instruction, expectedConfig) {
      it(`can parse \`${instruction}\``, function() {
        processTemplate(`{{! ${instruction} }}`);
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
    it('logs an error when it encounters an unknown rule name', function() {
      processTemplate(
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

    it("logs an error when it can't parse a configure instruction's JSON", function() {
      processTemplate('{{! template-lint-configure fake { not: "json" ] }}');
      expect(messages).toEqual([
        'malformed template-lint-configure instruction: `{ not: "json" ]` is not valid JSON',
      ]);
    });

    it('logs an error when it encounters an unrecognized instruction starting with `template-lint`', function() {
      processTemplate(
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

    it('only logs syntax errors once across all rules', function() {
      runRules(
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
  });

  describe('scopes instructions', function() {
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
      events.push([event, getId(node), plugin.config]);
    }

    function buildPlugin() {
      class FakeRule extends Rule {
        log(result) {
          messages.push(result.source);
        }

        visitor() {
          let pluginContext = this;

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

    function processTemplate(template, config) {
      if (config === undefined) {
        config = true;
      }

      runRules(template, [plugin(buildPlugin(), 'fake', config)]);
    }

    beforeEach(function() {
      messages = [];
      events = [];
    });

    function expectEvents(data) {
      let description = data.desc;
      let template = data.template;
      let expectedEvents = data.events;
      let config = data.config;

      it(description, function() {
        processTemplate(template, config);
        expect(events).toEqual(expectedEvents);
        expect(messages).toEqual([]);
      });
    }

    expectEvents({
      desc: 'handles top-level instructions',
      template: ['{{! template-lint-configure fake "foo" }}', '<div id="id1"></div>'].join('\n'),
      events: [
        ['comment/enter', '', true],
        ['comment/exit', '', 'foo'],
        ['element/enter', 'id1', 'foo'],
        ['element/enter:children', 'id1', 'foo'],
        ['element/exit:children', 'id1', 'foo'],
        ['element/exit', 'id1', 'foo'],
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
        ['element/enter', 'id1', true],
        ['element/enter:children', 'id1', true],
        ['comment/enter', '', true],
        ['comment/exit', '', 'foo'],
        ['element/enter', 'id2', 'foo'],
        ['element/enter:children', 'id2', 'foo'],
        ['element/exit:children', 'id2', 'foo'],
        ['element/exit', 'id2', 'foo'],
        ['element/exit:children', 'id1', true],
        ['element/exit', 'id1', true],
        ['element/enter', 'id3', true],
        ['element/enter:children', 'id3', true],
        ['element/exit:children', 'id3', true],
        ['element/exit', 'id3', true],
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
        ['element/enter', 'id1', true],
        ['element/enter:children', 'id1', true],
        ['comment/enter', '', true],
        ['comment/exit', '', 'foo'],
        ['element/enter', 'id2', 'foo'],
        ['element/enter:children', 'id2', 'foo'],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'bar'],
        ['element/enter', 'id3', 'bar'],
        ['element/enter:children', 'id3', 'bar'],
        ['element/exit:children', 'id3', 'bar'],
        ['element/exit', 'id3', 'bar'],
        ['element/exit:children', 'id2', 'foo'],
        ['element/exit', 'id2', 'foo'],
        ['element/exit:children', 'id1', true],
        ['element/exit', 'id1', true],
        ['element/enter', 'id4', true],
        ['element/enter:children', 'id4', true],
        ['element/exit:children', 'id4', true],
        ['element/exit', 'id4', true],
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
        ['element/enter', 'id1', true],
        ['element/enter:children', 'id1', true],
        ['comment/enter', '', true],
        ['comment/exit', '', 'foo'],
        ['element/enter', 'id2', 'foo'],
        ['element/enter:children', 'id2', 'foo'],
        ['element/exit:children', 'id2', 'foo'],
        ['element/exit', 'id2', 'foo'],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'bar'],
        ['element/enter', 'id3', 'bar'],
        ['element/enter:children', 'id3', 'bar'],
        ['element/exit:children', 'id3', 'bar'],
        ['element/exit', 'id3', 'bar'],
        ['element/exit:children', 'id1', true],
        ['element/exit', 'id1', true],
        ['element/enter', 'id4', true],
        ['element/enter:children', 'id4', true],
        ['element/exit:children', 'id4', true],
        ['element/exit', 'id4', true],
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
        ['element/enter', 'id1', true],
        ['element/enter:children', 'id1', true],
        ['element/enter', 'id2', 'foo'],
        ['element/enter:children', 'id2', true],
        ['element/enter', 'id3', true],
        ['element/enter:children', 'id3', true],
        ['element/enter', 'id4', true],
        ['element/enter:children', 'id4', true],
        ['element/exit:children', 'id4', true],
        ['element/exit', 'id4', true],
        ['element/exit:children', 'id3', true],
        ['element/exit', 'id3', true],
        ['element/exit:children', 'id2', true],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'foo'],
        ['element/exit', 'id2', 'foo'],
        ['element/exit:children', 'id1', true],
        ['element/exit', 'id1', true],
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
        ['element/enter', 'id1', true],
        ['element/enter:children', 'id1', true],
        ['element/enter', 'id2', 'foo'],
        ['element/enter:children', 'id2', 'foo'],
        ['element/enter', 'id3', 'foo'],
        ['element/enter:children', 'id3', 'foo'],
        ['element/enter', 'id4', 'foo'],
        ['element/enter:children', 'id4', 'foo'],
        ['element/exit:children', 'id4', 'foo'],
        ['element/exit', 'id4', 'foo'],
        ['element/exit:children', 'id3', 'foo'],
        ['element/exit', 'id3', 'foo'],
        ['element/exit:children', 'id2', 'foo'],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'foo'],
        ['element/exit', 'id2', 'foo'],
        ['element/exit:children', 'id1', true],
        ['element/exit', 'id1', true],
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
        ['element/enter', 'id1', 'foo'],
        ['element/enter:children', 'id1', 'foo'],
        ['element/enter', 'id2', 'foo'],
        ['element/enter:children', 'id2', 'foo'],
        ['element/enter', 'id3', 'bar'],
        ['element/enter:children', 'id3', 'foo'],
        ['element/enter', 'id4', 'foo'],
        ['element/enter:children', 'id4', 'foo'],
        ['element/exit:children', 'id4', 'foo'],
        ['element/exit', 'id4', 'foo'],
        ['element/exit:children', 'id3', 'foo'],
        ['comment/enter', '', 'bar'],
        ['comment/exit', '', 'bar'],
        ['element/exit', 'id3', 'bar'],
        ['element/exit:children', 'id2', 'foo'],
        ['element/exit', 'id2', 'foo'],
        ['element/exit:children', 'id1', 'foo'],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'foo'],
        ['element/exit', 'id1', 'foo'],
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
        ['element/enter', 'id1', 'foo'],
        ['element/enter:children', 'id1', 'foo'],
        ['element/enter', 'id2', 'foo'],
        ['element/enter:children', 'id2', 'foo'],
        ['element/enter', 'id3', 'bar'],
        ['element/enter:children', 'id3', 'bar'],
        ['element/enter', 'id4', 'bar'],
        ['element/enter:children', 'id4', 'bar'],
        ['element/exit:children', 'id4', 'bar'],
        ['element/exit', 'id4', 'bar'],
        ['element/exit:children', 'id3', 'bar'],
        ['comment/enter', '', 'bar'],
        ['comment/exit', '', 'bar'],
        ['element/exit', 'id3', 'bar'],
        ['element/exit:children', 'id2', 'foo'],
        ['element/exit', 'id2', 'foo'],
        ['element/exit:children', 'id1', 'foo'],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'foo'],
        ['element/exit', 'id1', 'foo'],
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
        ['element/enter', 'id1', 'foo'],
        ['element/enter:children', 'id1', 'foo'],
        ['element/enter', 'id2', 'foo'],
        ['element/enter:children', 'id2', 'foo'],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'bar'],
        ['element/enter', 'id3', 'bar'],
        ['element/enter:children', 'id3', 'bar'],
        ['element/enter', 'id4', 'bar'],
        ['element/enter:children', 'id4', 'bar'],
        ['element/exit:children', 'id4', 'bar'],
        ['element/exit', 'id4', 'bar'],
        ['element/exit:children', 'id3', 'bar'],
        ['element/exit', 'id3', 'bar'],
        ['element/exit:children', 'id2', 'foo'],
        ['element/exit', 'id2', 'foo'],
        ['element/exit:children', 'id1', 'foo'],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'foo'],
        ['element/exit', 'id1', 'foo'],
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
        ['element/enter', 'id1', 'foo'],
        ['element/enter:children', 'id1', 'foo'],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'bar'],
        ['element/enter', 'id2', 'bar'],
        ['element/enter:children', 'id2', 'bar'],
        ['comment/enter', '', 'bar'],
        ['comment/exit', '', 'foo'],
        ['element/enter', 'id4', 'foo'],
        ['element/enter:children', 'id4', 'foo'],
        ['element/exit:children', 'id4', 'foo'],
        ['element/exit', 'id4', 'foo'],
        ['element/exit:children', 'id2', 'bar'],
        ['element/exit', 'id2', 'bar'],
        ['element/exit:children', 'id1', 'foo'],
        ['element/exit', 'id1', 'foo'],
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
        ['comment/exit', '', true],
        ['element/enter', 'id2', true],
        ['element/enter:children', 'id2', true],
        ['element/exit:children', 'id2', true],
        ['element/exit', 'id2', true],
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
        ['element/enter', 'id1', true],
        ['element/enter:children', 'id1', true],
        ['element/enter', 'id2', 'foo'],
        ['element/enter:children', 'id2', true],
        ['element/enter', 'id3', true],
        ['element/enter:children', 'id3', true],
        ['element/enter', 'id4', true],
        ['element/enter:children', 'id4', true],
        ['element/exit:children', 'id4', true],
        ['element/exit', 'id4', true],
        ['element/exit:children', 'id3', true],
        ['element/exit', 'id3', true],
        ['element/exit:children', 'id2', true],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'foo'],
        ['comment/enter', '', 'foo'],
        ['comment/exit', '', 'foo'],
        ['element/exit', 'id2', 'foo'],
        ['element/exit:children', 'id1', true],
        ['element/exit', 'id1', true],
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
        ['element/enter', 'id1', true],
        ['element/enter:children', 'id1', true],
        ['element/enter:children', 'id2', true],
        ['element/enter', 'id3', true],
        ['element/enter:children', 'id3', true],
        ['element/enter', 'id4', true],
        ['element/enter:children', 'id4', true],
        ['element/exit:children', 'id4', true],
        ['element/exit', 'id4', true],
        ['element/exit:children', 'id3', true],
        ['element/exit', 'id3', true],
        ['element/exit:children', 'id2', true],
        ['element/exit:children', 'id1', true],
        ['element/exit', 'id1', true],
      ],
    });
  });
});

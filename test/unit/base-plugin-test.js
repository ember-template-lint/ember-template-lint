'use strict';

const expect = require('chai').expect;
const _precompile = require('@glimmer/compiler').precompile;
const buildPlugin = require('./../../lib/rules/base');

describe('base plugin', function() {
  function precompileTemplate(template, ast) {
    _precompile(template, {
      rawSource: template,
      moduleName: 'layout.hbs',
      plugins: {
        ast: ast
      }
    });
  }

  describe('parses templates', function() {
    let messages, config;

    function plugin() {
      let FakePlugin = buildPlugin({
        log(result) {
          messages.push(result.source);
        },
        name: 'fake',
        config: config
      });

      FakePlugin.prototype.visitors = function() {
        return {
          ElementNode(node) {
            this.process(node);
          },

          TextNode(node) {
            if (!node.loc) {
              return;
            }

            this.process(node);
          }
        };
      };

      FakePlugin.prototype.process = function(node) {
        this.log({
          message: 'Node source',
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node)
        });
      };

      return FakePlugin;
    }

    function precompile(template) {
      precompileTemplate(template, [ plugin() ]);
    }

    beforeEach(function() {
      messages = [];
      config = {};
    });

    function expectSource(config) {
      var template = config.template;
      var nodeSources = config.sources;

      it(`can get raw source for \`${template}\``, function() {
        precompile(template);

        expect(messages).to.deep.equal(nodeSources);
      });
    }

    expectSource({
      template: '<div>Foo</div>',
      sources: [
        '<div>Foo</div>',
        'Foo'
      ]
    });

    expectSource({
      template: '<div>\n  <div data-foo="blerp">\n    Wheee!\n  </div>\n</div>',
      sources: [
        '<div>\n  <div data-foo="blerp">\n    Wheee!\n  </div>\n</div>',
        '\n  ',
        '<div data-foo="blerp">\n    Wheee!\n  </div>',
        '"blerp"',
        '\n    Wheee!\n  ',
        '\n'
      ]
    });
  });

  describe('parses instructions', function() {
    var messages, config;

    function plugin(name) {
      var FakePlugin = buildPlugin({
        log(result) {
          messages.push(result.message);
        },
        name: name || 'fake',
        config: 'foo'
      });

      FakePlugin.prototype.visitors = function() {
        return {
          MustacheCommentStatement(node) {
            this.process(node);
          }
        };
      };

      FakePlugin.prototype.process = function(node) {
        config = this._processInstructionNode(node);
      };

      return FakePlugin;
    }

    function precompile(template) {
      precompileTemplate(template, [ plugin() ]);
    }

    beforeEach(function() {
      messages = [];
      config = null;
    });

    function expectConfig(instruction, expectedConfig) {
      it(`can parse \`${instruction}\``, function() {
        precompile(`{{! ${instruction} }}`);
        expect(config).to.deep.equal(expectedConfig);
        expect(messages).to.deep.equal([]);
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
    expectConfig('template-lint-disable fake \'bare-strings\'', { value: false, tree: false });
    expectConfig('template-lint-disable bare-strings fake block-indentation', { value: false, tree: false });
    expectConfig('template-lint-disable bare-strings', null);
    expectConfig(' template-lint-disable   fake ', { value: false, tree: false });
    expectConfig('template-lint-disable   bare-strings    fake   block-indentation ', { value: false, tree: false });

    // Configure
    expectConfig('template-lint-configure fake { "key1": "value", "key2": { "key3": 1 } }', {
      value: { key1: 'value', key2: { key3: 1 } },
      tree: false
    });
    expectConfig('template-lint-configure-tree "fake" { "key": "value" }', {
      value: { key: 'value' },
      tree: true
    });
    expectConfig('template-lint-configure-tree \'fake\' true', {
      value: true,
      tree: true
    });
    expectConfig('template-lint-configure-tree fake false', {
      value: false,
      tree: true
    });
    expectConfig('template-lint-configure-tree bare-strings { "key": "value" }', null);
    expectConfig('  template-lint-configure-tree    fake   { "key": "value" }', {
      value: { key: 'value' },
      tree: true
    });

    // Not config
    expectConfig('this code is awesome', null);
    expectConfig('', null);

    // Errors
    it('logs an error when it encounters an unknown rule name', function() {
      precompile([
        '{{! template-lint-enable notarule }}',
        '{{! template-lint-disable fake norme meneither }}',
        '{{! template-lint-configure nope false }}'
      ].join('\n'));
      expect(messages).to.deep.equal([
        'unrecognized rule name `notarule` in template-lint-enable instruction',
        'unrecognized rule name `norme` in template-lint-disable instruction',
        'unrecognized rule name `meneither` in template-lint-disable instruction',
        'unrecognized rule name `nope` in template-lint-configure instruction'
      ]);
    });

    it('logs an error when it can\'t parse a configure instruction\'s JSON', function() {
      precompile('{{! template-lint-configure fake { not: "json" ] }}');
      expect(messages).to.deep.equal([
        'malformed template-lint-configure instruction: `{ not: "json" ]` is not valid JSON'
      ]);
    });

    it('logs an error when it encounters an unrecognized instruction starting with `template-lint`', function() {
      precompile([
        '{{! template-lint-bloober fake }}',
        '{{! template-lint- fake }}',
        '{{! template-lint fake }}'
      ].join('\n'));
      expect(messages).to.deep.equal([
        'unrecognized template-lint instruction: `template-lint-bloober`',
        'unrecognized template-lint instruction: `template-lint-`',
        'unrecognized template-lint instruction: `template-lint`'
      ]);
    });

    it('only logs syntax errors once across all rules', function() {
      precompileTemplate('{{! template-lint-enable notarule }}{{! template-lint-disable meneither }}{{! template-lint-configure norme true }}', [
        plugin('fake1'),
        plugin('fake2'),
        plugin('fake3'),
        plugin('fake4'),
        plugin('fake5')
      ]);
      expect(messages).to.have.lengthOf(3);
    });
  });

  describe('scopes instructions', function() {
    var messages, events;

    function getId(node) {
      if (node.attributes) {
        for (var i = 0; i < node.attributes.length; i++) {
          if (node.attributes[i].name === 'id') {
            return node.attributes[i].value.chars;
          }
        }
      }
      return '';
    }

    function addEvent(event, node, plugin) {
      events.push([ event, getId(node), plugin.config ]);
    }

    function plugin(config) {
      if (config === undefined) {
        config = true;
      }

      var FakePlugin = buildPlugin({
        log(result) {
          messages.push(result.source);
        },
        name: 'fake',
        config: config
      });

      FakePlugin.prototype.visitors = function() {
        var pluginContext = this;

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
                }
              }
            }
          },
          MustacheCommentStatement: {
            enter(node) {
              addEvent('comment/enter', node, pluginContext);
            },
            exit(node) {
              addEvent('comment/exit', node, pluginContext);
            }
          }
        };
      };

      return FakePlugin;
    }

    function precompile(template, config) {
      precompileTemplate(template, [ plugin(config) ]);
    }

    beforeEach(function() {
      messages = [];
      events = [];
    });

    function expectEvents(data) {
      var description = data.desc;
      var template = data.template;
      var expectedEvents = data.events;
      var config = data.config;

      it(description, function() {
        precompile(template, config);
        expect(events).to.deep.equal(expectedEvents);
        expect(messages).to.deep.equal([]);
      });
    }

    expectEvents({
      desc: 'handles top-level instructions',
      template: [
        '{{! template-lint-configure fake "foo" }}',
        '<div id="id1"></div>'
      ].join('\n'),
      events: [
        [ 'comment/enter',          '',    true  ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/enter',          'id1', 'foo' ],
        [ 'element/enter:children', 'id1', 'foo' ],
        [ 'element/exit:children',  'id1', 'foo' ],
        [ 'element/exit',           'id1', 'foo' ]
      ]
    });

    expectEvents({
      desc: 'handles element-child instructions',
      template: [
        '<div id="id1">',
        '  {{! template-lint-configure fake "foo" }}',
        '  <span id="id2"></span>',
        '</div>',
        '<i id="id3"></i>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', true  ],
        [ 'element/enter:children', 'id1', true  ],
        [ 'comment/enter',          '',    true  ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/enter',          'id2', 'foo' ],
        [ 'element/enter:children', 'id2', 'foo' ],
        [ 'element/exit:children',  'id2', 'foo' ],
        [ 'element/exit',           'id2', 'foo' ],
        [ 'element/exit:children',  'id1', true  ],
        [ 'element/exit',           'id1', true  ],
        [ 'element/enter',          'id3', true  ],
        [ 'element/enter:children', 'id3', true  ],
        [ 'element/exit:children',  'id3', true  ],
        [ 'element/exit',           'id3', true  ]
      ]
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
        '<i id="id4"></i>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', true  ],
        [ 'element/enter:children', 'id1', true  ],
        [ 'comment/enter',          '',    true  ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/enter',          'id2', 'foo' ],
        [ 'element/enter:children', 'id2', 'foo' ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'bar' ],
        [ 'element/enter',          'id3', 'bar' ],
        [ 'element/enter:children', 'id3', 'bar' ],
        [ 'element/exit:children',  'id3', 'bar' ],
        [ 'element/exit',           'id3', 'bar' ],
        [ 'element/exit:children',  'id2', 'foo' ],
        [ 'element/exit',           'id2', 'foo' ],
        [ 'element/exit:children',  'id1', true  ],
        [ 'element/exit',           'id1', true  ],
        [ 'element/enter',          'id4', true  ],
        [ 'element/enter:children', 'id4', true  ],
        [ 'element/exit:children',  'id4', true  ],
        [ 'element/exit',           'id4', true  ]
      ]
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
        '<i id="id4"></i>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', true  ],
        [ 'element/enter:children', 'id1', true  ],
        [ 'comment/enter',          '',    true  ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/enter',          'id2', 'foo' ],
        [ 'element/enter:children', 'id2', 'foo' ],
        [ 'element/exit:children',  'id2', 'foo' ],
        [ 'element/exit',           'id2', 'foo' ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'bar' ],
        [ 'element/enter',          'id3', 'bar' ],
        [ 'element/enter:children', 'id3', 'bar' ],
        [ 'element/exit:children',  'id3', 'bar' ],
        [ 'element/exit',           'id3', 'bar' ],
        [ 'element/exit:children',  'id1', true  ],
        [ 'element/exit',           'id1', true  ],
        [ 'element/enter',          'id4', true  ],
        [ 'element/enter:children', 'id4', true  ],
        [ 'element/exit:children',  'id4', true  ],
        [ 'element/exit',           'id4', true  ]
      ]
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
        '</div>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', true  ],
        [ 'element/enter:children', 'id1', true  ],
        [ 'element/enter',          'id2', 'foo' ],
        [ 'element/enter:children', 'id2', true  ],
        [ 'element/enter',          'id3', true  ],
        [ 'element/enter:children', 'id3', true  ],
        [ 'element/enter',          'id4', true  ],
        [ 'element/enter:children', 'id4', true  ],
        [ 'element/exit:children',  'id4', true  ],
        [ 'element/exit',           'id4', true  ],
        [ 'element/exit:children',  'id3', true  ],
        [ 'element/exit',           'id3', true  ],
        [ 'element/exit:children',  'id2', true  ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/exit',           'id2', 'foo' ],
        [ 'element/exit:children',  'id1', true  ],
        [ 'element/exit',           'id1', true  ]
      ]
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
        '</div>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', true  ],
        [ 'element/enter:children', 'id1', true  ],
        [ 'element/enter',          'id2', 'foo' ],
        [ 'element/enter:children', 'id2', 'foo' ],
        [ 'element/enter',          'id3', 'foo' ],
        [ 'element/enter:children', 'id3', 'foo' ],
        [ 'element/enter',          'id4', 'foo' ],
        [ 'element/enter:children', 'id4', 'foo' ],
        [ 'element/exit:children',  'id4', 'foo' ],
        [ 'element/exit',           'id4', 'foo' ],
        [ 'element/exit:children',  'id3', 'foo' ],
        [ 'element/exit',           'id3', 'foo' ],
        [ 'element/exit:children',  'id2', 'foo' ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/exit',           'id2', 'foo' ],
        [ 'element/exit:children',  'id1', true  ],
        [ 'element/exit',           'id1', true  ]
      ]
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
        '</div>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', 'foo' ],
        [ 'element/enter:children', 'id1', 'foo' ],
        [ 'element/enter',          'id2', 'foo' ],
        [ 'element/enter:children', 'id2', 'foo' ],
        [ 'element/enter',          'id3', 'bar' ],
        [ 'element/enter:children', 'id3', 'foo' ],
        [ 'element/enter',          'id4', 'foo' ],
        [ 'element/enter:children', 'id4', 'foo' ],
        [ 'element/exit:children',  'id4', 'foo' ],
        [ 'element/exit',           'id4', 'foo' ],
        [ 'element/exit:children',  'id3', 'foo' ],
        [ 'comment/enter',          '',    'bar' ],
        [ 'comment/exit',           '',    'bar' ],
        [ 'element/exit',           'id3', 'bar' ],
        [ 'element/exit:children',  'id2', 'foo' ],
        [ 'element/exit',           'id2', 'foo' ],
        [ 'element/exit:children',  'id1', 'foo' ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/exit',           'id1', 'foo' ]
      ]
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
        '</div>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', 'foo' ],
        [ 'element/enter:children', 'id1', 'foo' ],
        [ 'element/enter',          'id2', 'foo' ],
        [ 'element/enter:children', 'id2', 'foo' ],
        [ 'element/enter',          'id3', 'bar' ],
        [ 'element/enter:children', 'id3', 'bar' ],
        [ 'element/enter',          'id4', 'bar' ],
        [ 'element/enter:children', 'id4', 'bar' ],
        [ 'element/exit:children',  'id4', 'bar' ],
        [ 'element/exit',           'id4', 'bar' ],
        [ 'element/exit:children',  'id3', 'bar' ],
        [ 'comment/enter',          '',    'bar' ],
        [ 'comment/exit',           '',    'bar' ],
        [ 'element/exit',           'id3', 'bar' ],
        [ 'element/exit:children',  'id2', 'foo' ],
        [ 'element/exit',           'id2', 'foo' ],
        [ 'element/exit:children',  'id1', 'foo' ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/exit',           'id1', 'foo' ]
      ]
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
        '</div>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', 'foo' ],
        [ 'element/enter:children', 'id1', 'foo' ],
        [ 'element/enter',          'id2', 'foo' ],
        [ 'element/enter:children', 'id2', 'foo' ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'bar' ],
        [ 'element/enter',          'id3', 'bar' ],
        [ 'element/enter:children', 'id3', 'bar' ],
        [ 'element/enter',          'id4', 'bar' ],
        [ 'element/enter:children', 'id4', 'bar' ],
        [ 'element/exit:children',  'id4', 'bar' ],
        [ 'element/exit',           'id4', 'bar' ],
        [ 'element/exit:children',  'id3', 'bar' ],
        [ 'element/exit',           'id3', 'bar' ],
        [ 'element/exit:children',  'id2', 'foo' ],
        [ 'element/exit',           'id2', 'foo' ],
        [ 'element/exit:children',  'id1', 'foo' ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/exit',           'id1', 'foo' ]
      ]
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
        '</div>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', 'foo' ],
        [ 'element/enter:children', 'id1', 'foo' ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'bar' ],
        [ 'element/enter',          'id2', 'bar' ],
        [ 'element/enter:children', 'id2', 'bar' ],
        [ 'comment/enter',          '',    'bar' ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/enter',          'id4', 'foo' ],
        [ 'element/enter:children', 'id4', 'foo' ],
        [ 'element/exit:children',  'id4', 'foo' ],
        [ 'element/exit',           'id4', 'foo' ],
        [ 'element/exit:children',  'id2', 'bar' ],
        [ 'element/exit',           'id2', 'bar' ],
        [ 'element/exit:children',  'id1', 'foo' ],
        [ 'element/exit',           'id1', 'foo' ]
      ]
    });

    expectEvents({
      desc: 'enabling a disabled-by-default rule actually enables it',
      config: false,
      template: [
        '<div id="id1">',
        '  {{! template-lint-enable fake }}',
        '  <span id="id2"></span>',
        '</div>'
      ].join('\n'),
      events: [
        [ 'comment/exit',           '',    true  ],
        [ 'element/enter',          'id2', true  ],
        [ 'element/enter:children', 'id2', true  ],
        [ 'element/exit:children',  'id2', true  ],
        [ 'element/exit',           'id2', true  ]
      ]
    });

    // Not really a case that makes sense, but just to be sure it doesn't mess
    // up the config stack
    expectEvents({
      desc: 'ensures this pretty silly case doesn\'t mess up the config stack',
      template: [
        '<div id="id1">',
        '  <span id="id2" {{! template-lint-configure fake "bar" }} {{! template-lint-configure fake "foo" }}>',
        '    <i id="id3">',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', true  ],
        [ 'element/enter:children', 'id1', true  ],
        [ 'element/enter',          'id2', 'foo' ],
        [ 'element/enter:children', 'id2', true  ],
        [ 'element/enter',          'id3', true  ],
        [ 'element/enter:children', 'id3', true  ],
        [ 'element/enter',          'id4', true  ],
        [ 'element/enter:children', 'id4', true  ],
        [ 'element/exit:children',  'id4', true  ],
        [ 'element/exit',           'id4', true  ],
        [ 'element/exit:children',  'id3', true  ],
        [ 'element/exit',           'id3', true  ],
        [ 'element/exit:children',  'id2', true  ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'comment/enter',          '',    'foo' ],
        [ 'comment/exit',           '',    'foo' ],
        [ 'element/exit',           'id2', 'foo' ],
        [ 'element/exit:children',  'id1', true  ],
        [ 'element/exit',           'id1', true  ]
      ]
    });

    expectEvents({
      desc: 'it doesn\'t call a disabled rule\'s visitor handlers',
      template: [
        '<div id="id1">',
        '  <span id="id2" {{! template-lint-disable fake }}>',
        '    <i id="id3">',
        '      <b id="id4"/>',
        '    </i>',
        '  </span>',
        '</div>'
      ].join('\n'),
      events: [
        [ 'element/enter',          'id1', true  ],
        [ 'element/enter:children', 'id1', true  ],
        [ 'element/enter:children', 'id2', true  ],
        [ 'element/enter',          'id3', true  ],
        [ 'element/enter:children', 'id3', true  ],
        [ 'element/enter',          'id4', true  ],
        [ 'element/enter:children', 'id4', true  ],
        [ 'element/exit:children',  'id4', true  ],
        [ 'element/exit',           'id4', true  ],
        [ 'element/exit:children',  'id3', true  ],
        [ 'element/exit',           'id3', true  ],
        [ 'element/exit:children',  'id2', true  ],
        [ 'element/exit:children',  'id1', true  ],
        [ 'element/exit',           'id1', true  ]
      ]
    });
  });
});

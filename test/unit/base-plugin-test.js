'use strict';

var assert = require('power-assert');
var _compile = require('htmlbars').compile;
var buildPlugin = require('./../../lib/rules/base');
var ast = require('./../../lib/helpers/ast-node-info');

describe('base plugin tests', function() {
  var messages, config;

  function plugin() {
    var FakePlugin = buildPlugin({
      log: function(result) {
        messages.push(result.source);
      },
      name: 'fake',
      config: config
    });

    FakePlugin.prototype.detect = function(node) {
      return ast.isElementNode(node) || ast.isTextNode(node);
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

  function compile(template) {
    _compile(template, {
      rawSource: template,
      moduleName: 'layout.hbs',
      plugins: {
        ast: [
          plugin()
        ]
      }
    });
  }

  beforeEach(function() {
    messages = [];
    config   = {};
  });

  function expectSource(config) {
    var template = config.template;
    var nodeSources = config.sources;

    it('can get raw source for `' + template + '`', function() {
      compile(template);

      assert.deepEqual(messages, nodeSources);
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
      '\n    Wheee!\n  ',
      '\n'
    ]
  });
});

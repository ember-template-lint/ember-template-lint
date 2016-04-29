'use strict';

var assert = require('power-assert');
var _compile = require('htmlbars').compile;
var buildPlugin = require('./../../ext/plugins/base');
var ast = require('./../../ext/helpers/ast-node-info');

describe('base plugin tests', function() {
  var addonContext, messages, config;

  function plugin(addonContext) {
    var FakePlugin = buildPlugin(addonContext, 'fake');

    FakePlugin.prototype.detect = function(node) {
      return ast.isElementNode(node) || ast.isTextNode(node);
    };

    FakePlugin.prototype.process = function(node) {
      this.log(this.sourceForNode(node));
    };

    return FakePlugin;
  }

  function compile(template) {
    _compile(template, {
      rawSource: template,
      moduleName: 'layout.hbs',
      plugins: {
        ast: [
          plugin(addonContext)
        ]
      }
    });
  }

  beforeEach(function() {
    messages = [];
    config   = {};

    addonContext = {
      logLintingError: function(pluginName, moduleName, message) {
        messages.push(message);
      },
      loadConfig: function() {
        return config;
      }
    };
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

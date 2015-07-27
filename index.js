/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-template-lint',

  _findHtmlbarsPreprocessor: function(registry) {
    var plugins = registry.load('template');

    return plugins.filter(function(plugin) {
      return plugin.name === 'ember-cli-htmlbars';
    })[0];
  },

  _monkeyPatch_EmberDeprecate: function(htmlbarsCompilerPreprocessor) {
    var addonContext = this;
    var originalToTree = htmlbarsCompilerPreprocessor.toTree;

    htmlbarsCompilerPreprocessor.toTree = function() {
      var htmlbarsCompiler = originalToTree.apply(this, arguments);
      var originalDeprecate = htmlbarsCompiler.options.templateCompiler._Ember.deprecate;

      htmlbarsCompiler.options.templateCompiler._Ember.deprecate = function(message, test, options) {
        if (!test) {
          addonContext._deprecations.push({
            message: JSON.stringify(message),
            test: !!test,
            options: JSON.stringify(options)
          });
        }

        return originalDeprecate.apply(this, arguments);
      };

      return htmlbarsCompiler;
    };
  },

  setupPreprocessorRegistry: function(type, registry) {
    if (type === 'parent') {
      var htmlbarsCompilerPreprocessor = this._findHtmlbarsPreprocessor(registry);

      this._monkeyPatch_EmberDeprecate(htmlbarsCompilerPreprocessor);
    }
  },

  init: function() {
    this._deprecations = [];
  },

  lintTree: function(type, tree) {
    var ui = this.ui;
    var TemplateLinter = require('./generate-deprecations-tree');

    return new TemplateLinter(this);
  }
};

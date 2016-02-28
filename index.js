/* jshint node: true */
'use strict';

var existsSync = require('exists-sync');
var chalk = require('chalk');

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
    var originalHtmlbarsOptions = htmlbarsCompilerPreprocessor._addon.htmlbarsOptions;
    var logToNodeConsole = this.project.config(process.env.EMBER_ENV).logTemplateLintToConsole;

    htmlbarsCompilerPreprocessor._addon.htmlbarsOptions = function() {
      var options = originalHtmlbarsOptions.apply(this, arguments);
      var originalDeprecate = options.templateCompiler._Ember.deprecate;

      options.templateCompiler._Ember.deprecate = function(message, test, options) {
        var noDeprecation;

        if (typeof test === "function") {
          noDeprecation = test();
        } else {
          noDeprecation = test;
        }

        if (!noDeprecation) {
          addonContext._deprecations.push({
            message: JSON.stringify(message),
            test: !!test,
            options: JSON.stringify(options)
          });
        }

        if (logToNodeConsole) {
          return originalDeprecate.apply(this, arguments);
        }
      };

      return options;
    };
  },

  setupPreprocessorRegistry: function(type, registry) {
    if (type === 'parent') {
      var htmlbarsCompilerPreprocessor = this._findHtmlbarsPreprocessor(registry);

      this._monkeyPatch_EmberDeprecate(htmlbarsCompilerPreprocessor);
    }

    var plugins = require('./ext/plugins');
    for (var name in plugins) {
      registry.add('htmlbars-ast-plugin', {
        name: name,
        plugin: plugins[name](this)
      });
    }
  },

  loadConfig: function() {
    var defaultConfig  = this.project.root + '/.template-lintrc';
    var overrideConfig = process.env['TEMPLATE_LINTRC'];
    var config = overrideConfig || defaultConfig
    if(existsSync(config)) {
      return require(config);
    } else {
      return {};
    }
  },

  logLintingError: function(pluginName, moduleName, message) {
    this.ui.writeLine(chalk.yellow(message));
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

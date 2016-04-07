'use strict';

module.exports = function(addonContext, name) {
  function BasePlugin(options) {
    this.options = options;
    this.syntax = null; // set by HTMLBars

    this.config = this.parseConfig(
      addonContext.loadConfig()[name]
    );
  }

  BasePlugin.prototype.parseConfig = function(config) {
    return config;
  };

  BasePlugin.prototype.transform = function(ast) {
    var pluginContext = this;
    var walker = new this.syntax.Walker();

    walker.visit(ast, function(node) {
      pluginContext._processConfigStatement(node);

      if (pluginContext.isDisabled()) {
        // do nothing
      } else if (pluginContext.detect(node)) {
        pluginContext.process(node);
      }
    });

    return ast;
  };

  BasePlugin.prototype._processConfigStatement = function(node) {
    var bodyEntry;

    if (node.type === 'Program') {
      for (var i = 0; i < node.body.length; i++) {
        bodyEntry = node.body[i];

        // process `<!-- template-lint foo=bar -->` comments
        if (bodyEntry.type === 'CommentStatement' && bodyEntry.value.indexOf('template-lint') === 1) {
          this._processConfigNode(bodyEntry);
        }
      }
    }
  };

  BasePlugin.prototype._processConfigNode = function(node) {
    var hashParts = node.value
          .trim()
          .slice(14)
          .split(/\s+/);

    var hash = hashParts.reduce(function(memo, part) {
      var parts = part.split('=');

      memo[parts[0]] = parts[1];

      return memo;
    }, {});

    for (var key in hash) {
      var value = hash[key];

      // handle <!-- template-lint disabled=true -->
      if (key === 'disable' && value === 'true') {
        this.config = false;
      }

      // handle <!-- template-lint block-indentation=false -->
      if (key === name && value === 'false') {
        this.config = false;
      }
    }
  };

  BasePlugin.prototype.isDisabled = function() {
    return this.config === false;
  };

  BasePlugin.prototype.log = function(message) {
    addonContext.logLintingError(name, this.options.moduleName, message);
  };

  BasePlugin.prototype.detect = function() {
    throw new Error('Must implemented #detect');
  };

  BasePlugin.prototype.process = function() {
    throw new Error('Must implemented #process');
  };

  return BasePlugin;
};

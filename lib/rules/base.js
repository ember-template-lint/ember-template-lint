'use strict';

var assign = require('lodash').assign;

function invokeVisitorEnter(visitor, args, thisContext) {
  var func;

  if (typeof visitor === 'function') {
    func = visitor;
  } else if (visitor && visitor.enter) {
    func = visitor.enter;
  }

  return func.apply(thisContext, args);
}

module.exports = function(options) {
  var log = options.log;
  var config = options.config;
  var ruleName = options.name;
  var defaultSeverity = options.defaultSeverity;

  function BasePlugin(options) {
    this.options = options;
    this.syntax = null; // set by HTMLBars

    // split into a source array (allow windows and posix line endings)
    this.source = this.options.rawSource.split(/(?:\r\n?|\n)/g);

    this.ruleName = ruleName;
    this.severity = defaultSeverity;
    this.config = this.parseConfig(config);
    this._log = log;
  }

  BasePlugin.prototype.parseConfig = function(config) {
    return config;
  };

  BasePlugin.prototype.transform = function(ast) {
    this.syntax.traverse(ast, this.getVisitors());

    return ast;
  };


  BasePlugin.prototype.getVisitors = function() {
    var pluginContext = this;
    var visitors = {};
    var ruleVisitors = this.visitors();
    var ruleVisitor;

    for (var key in ruleVisitors) {
      ruleVisitor = ruleVisitors[key];

      visitors[key] = this.processVisitor(ruleVisitor);
    }

    var commentVisitor = visitors['CommentStatement'];
    if (!commentVisitor) {
      commentVisitor = visitors['CommentStatement'] = { enter: function() {} };
    }

    var commentVisitorEnter = commentVisitor.enter;
    if (commentVisitorEnter) {
      commentVisitor.enter = function(node) {
        if (node.value.indexOf('template-lint') > -1) {
          pluginContext._processConfigNode(node);
        }

        commentVisitorEnter.apply(this, arguments);
      };
    }

    return visitors;
  };

  BasePlugin.prototype.processVisitor = function(ruleVisitor) {
    var pluginContext = this;
    var visitor = {
      enter: function(node) {
        if (!pluginContext.isDisabled()) {
          invokeVisitorEnter(ruleVisitor, [node], pluginContext);
        }
      }
    };

    if (ruleVisitor && ruleVisitor.exit) {
      visitor.exit = function(node) {
        if (!pluginContext.isDisabled()) {
          ruleVisitor.exit.apply(pluginContext, [node]);
        }
      };
    }

    return visitor;
  };

  BasePlugin.prototype.visitors = function() { };

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
      if (key === ruleName && value === 'false') {
        this.config = false;
      }
    }
  };

  BasePlugin.prototype.isDisabled = function() {
    return !this.config;
  };

  BasePlugin.prototype.log = function(result) {
    var defaults = {
      moduleId: this.options.moduleName,
      rule: this.ruleName,
      severity: this.severity
    };
    var reportedResult = assign({}, defaults, result);

    this._log(reportedResult);
  };

  BasePlugin.prototype.detect = function() {
    throw new Error('Must implemented #detect');
  };

  BasePlugin.prototype.process = function() {
    throw new Error('Must implemented #process');
  };

  // mostly copy/pasta from tildeio/htmlbars with a few tweaks:
  // https://github.com/tildeio/htmlbars/blob/v0.4.17/packages/htmlbars-syntax/lib/parser.js#L59-L90
  BasePlugin.prototype.sourceForNode = function(node) {
    if (!node.loc) { return; }

    var firstLine = node.loc.start.line - 1;
    var lastLine = node.loc.end.line - 1;
    var currentLine = firstLine - 1;
    var firstColumn = node.loc.start.column;
    var lastColumn = node.loc.end.column;
    var string = [];
    var line;

    while (currentLine < lastLine) {
      currentLine++;
      line = this.source[currentLine];

      if (currentLine === firstLine) {
        if (firstLine === lastLine) {
          string.push(line.slice(firstColumn, lastColumn));
        } else {
          string.push(line.slice(firstColumn));
        }
      } else if (currentLine === lastLine) {
        string.push(line.slice(0, lastColumn));
      } else {
        string.push(line);
      }
    }

    return string.join('\n');
  };

  return BasePlugin;
};

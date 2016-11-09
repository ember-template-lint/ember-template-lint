'use strict';

var _ = require('lodash');
var assign = _.assign;

module.exports = function(options) {
  var log = options.log;
  var config = options.config;
  var ruleName = options.name;
  var defaultSeverity = options.defaultSeverity;

  function BasePlugin(options) {
    this.options = options;
    this.syntax = null; // set by Glimmer

    // split into a source array (allow windows and posix line endings)
    this.source = this.options.rawSource.split(/(?:\r\n?|\n)/g);

    this._log = log;
    this.ruleName = ruleName;
    this.severity = defaultSeverity;
    // To support DOM-scoped configuration instructions, we need to maintain
    // a stack of our configurations so we can restore the previous one when
    // the current one goes out of scope. The current one is duplicated in
    // this.config so the rule implementations don't need to worry about the
    // fact that there is a stack.
    this.config = this.parseConfig(config);
    this.configStack = [this.config];
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
    // We use this structure to advise/unadvise on AST events. The walkers we
    // set up read this structure every time they get an AST event and call the
    // appropriate functions. Handlers get added to the before/after list
    // according to whether they will be called before/after the rule's AST
    // event handlers.
    var astHandlers = {
      CommentStatement: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] }
      },
      MustacheCommentStatement: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] }
      },
      ElementNode: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] },
        keys: {
          children: {
            enter: { before: [], after: [] },
            exit: { before: [], after: [] }
          },
          comments: {
            enter: { before: [], after: [] },
            exit: { before: [], after: [] }
          }
        }
      }
    };
    // Keep a stack of ancestor elements so that when we encounter a comment
    // that is the child of an element (i.e. not within the element's tag)
    // we know what it's parent is so we can set up a listener for when we
    // leave the comment's siblings.
    var elementStack = [];
    // We don't traverse in-element comments until after we've entered the
    // element, but we need to apply such instructions before we enter the
    // element. So, we have an element enter handler that processes that
    // element's comments, which means we need to distinguish in-element
    // comments from child-of-element comments during the traverse so we can
    // ignore the former, but still process the latter.
    var inElementComments = false;

    //
    // Wrap all visitors supplied by the rule, plus make sure we have entries
    // for the visitors we use internally for instruction processing. This is
    // done for two reasons -- one is to support instruction processing, but
    // the other is to allow the rule's visitor handlers to have their this
    // context set to the plugin, which isn't what HTMLBars does.
    //
    for (var key in ruleVisitors) {
      visitors[key] = this._wrapVisitor(ruleVisitors[key], astHandlers[key]);
    }

    visitors.CommentStatement = visitors.CommentStatement || this._wrapVisitor(null, astHandlers.CommentStatement);
    visitors.MustacheCommentStatement = visitors.MustacheCommentStatement || this._wrapVisitor(null, astHandlers.MustacheCommentStatement);
    visitors.ElementNode = visitors.ElementNode || this._wrapVisitor(null, astHandlers.ElementNode);

    //
    // Set up our handlers
    //

    // Manage elementStack
    astHandlers.ElementNode.keys.children.enter.before.push(function(elementNode) {
      elementStack.push(elementNode);
    });
    astHandlers.ElementNode.keys.children.exit.after.push(function(elementNode) {
      if (elementNode !== _.last(elementStack)) {
        throw new Error('Element stack out of sync with AST!');
      }
      elementStack.pop();
    });

    // Manage inElementComments
    astHandlers.ElementNode.keys.comments.enter.before.push(function() {
      inElementComments = true;
    });
    astHandlers.ElementNode.keys.comments.exit.after.push(function() {
      if (!inElementComments) {
        throw new Error('Element comments state out of sync with AST!');
      }
      inElementComments = false;
    });

    // Handle legacy config statements
    astHandlers.CommentStatement.enter.after.push(function(node) {
      if (node.value.indexOf('template-lint') === -1) {
        return;
      }

      // TODO: deprecation warning
      pluginContext._processLegacyConfigNode(node);
    });

    // Handle element-child config statements
    astHandlers.MustacheCommentStatement.enter.after.push(function(commentNode) {
      if (inElementComments) {
        return;
      }

      var config = pluginContext._processInstructionNode(commentNode);
      if (!config) {
        return;
      }

      pluginContext._pushConfig(config.value);

      // Pop the config once we exit the comment's siblings
      var parentNode = _.last(elementStack);
      astHandlers.ElementNode.keys.children.exit.before.unshift(function(elementNode) {
        if (elementNode === parentNode) {
          pluginContext._popConfig(config.value);
          return false;
        }
      });
    });

    // Handle in-element config statements
    astHandlers.ElementNode.enter.before.push(function(elementNode) {
      elementNode.comments.forEach(function(commentNode) {
        var config = pluginContext._processInstructionNode(commentNode);
        if (!config) {
          return;
        }

        pluginContext._pushConfig(config.value);

        if (config.tree) {
          // Applies to descendants, so pop the config once we exit the
          // comment's element
          astHandlers.ElementNode.exit.after.unshift(function(node) {
            if (node === elementNode) {
              pluginContext._popConfig(config.value);
              return false;
            }
          });
        } else {
          // Applies to only this element, so pop the config when we enter the
          // element's children, re-push it when we exit the element's
          // children, and then re-pop it when we exit the element entirely.
          astHandlers.ElementNode.keys.children.enter.before.unshift(function(node) {
            if (node === elementNode) {
              pluginContext._popConfig(config.value);
              return false;
            }
          });
          astHandlers.ElementNode.keys.children.exit.after.push(function(node) {
            if (node === elementNode) {
              pluginContext._pushConfig(config.value);
              return false;
            }
          });
          astHandlers.ElementNode.exit.after.unshift(function(node) {
            if (node === elementNode) {
              pluginContext._popConfig(config.value);
              return false;
            }
          });
        }
      });
    });

    return visitors;
  };

  BasePlugin.prototype.visitors = function() { };

  // Generate a visitor handler function for a specific node type/event that
  // will call the internal handlers and the rule handler for that node
  // type/event in the correct order.
  BasePlugin.prototype._wrapVisitorHandler = function(ruleHandler, internalHandlers) {
    internalHandlers = internalHandlers || {};
    var beforeHandlers = internalHandlers.before || [];
    var afterHandlers = internalHandlers.after || [];
    var plugin = this;
    var i, ret;

    return function() {
      for (i = 0; i < beforeHandlers.length; i++) {
        ret = beforeHandlers[i].apply(plugin, arguments);
        if (ret === false) {
          beforeHandlers.splice(i, 1);
          i -= 1;
        }
      }

      if (ruleHandler && !plugin.isDisabled()) {
        ruleHandler.apply(plugin, arguments);
      }

      for (i = 0; i < afterHandlers.length; i++) {
        ret = afterHandlers[i].apply(plugin, arguments);
        if (ret === false) {
          afterHandlers.splice(i, 1);
          i -= 1;
        }
      }
    };
  };

  // Give the rule's visitor for a given node type, and our internal
  // astHandlers registry for that node type, generate a visitor that will
  // call all the various event handlers in the proper order
  BasePlugin.prototype._wrapVisitor = function(ruleVisitor, astHandlers) {
    if (typeof ruleVisitor === 'function') {
      ruleVisitor = { enter: ruleVisitor };
    }

    ruleVisitor = ruleVisitor || {};
    astHandlers = astHandlers || {};

    var visitorKeys = ruleVisitor.keys || {};
    var visitorChildren = visitorKeys.children || {};
    var visitorComments = visitorKeys.comments || {};
    var internalKeys = astHandlers.keys || {};
    var internalChildren = internalKeys.children || {};
    var internalComments = internalKeys.comments || {};

    return {
      enter: this._wrapVisitorHandler(ruleVisitor.enter, astHandlers.enter),
      exit: this._wrapVisitorHandler(ruleVisitor.exit, astHandlers.exit),
      keys: {
        children: {
          enter: this._wrapVisitorHandler(visitorChildren.enter, internalChildren.enter),
          exit: this._wrapVisitorHandler(visitorChildren.exit, internalChildren.exit)
        },
        comments: {
          enter: this._wrapVisitorHandler(visitorComments.enter, internalComments.enter),
          exit: this._wrapVisitorHandler(visitorComments.exit, internalComments.exit)
        }
      }
    };
  };

  BasePlugin.prototype._pushConfig = function(config) {
    this.configStack.push(config);
    this.config = config;
  };

  BasePlugin.prototype._popConfig = function(config) {
    if (_.last(this.configStack) !== config) {
      throw new Error('Configuration stack out of sync with AST!');
    }

    this.configStack.pop();
    this.config = _.last(this.configStack);
  };

  BasePlugin.prototype._processInstructionNode = function(node) {
    var nodeValue = node.value.trim();
    var instructionName = nodeValue.split(/\s/)[0];
    var instructionArgs = nodeValue.slice(instructionName.length + 1).trim();
    var config = { tree: false };
    var m;

    m = /^(.*)-tree$/.exec(instructionName);
    if (m) {
      config.tree = true;
      instructionName = m[1];
    }

    m = /^template-lint-(enable|disable)$/.exec(instructionName);
    if (m) {
      // It either disables all rules (no instruction args), or it disables an
      // explicit list of rules.
      if (instructionArgs && instructionArgs.split(/\s/).indexOf(ruleName) === -1) {
        // Explicit list that doesn't include us
        return null;
      }

      config.value = (m[1] === 'enable');
      return config;
    } else if (instructionName === 'template-lint-configure') {
      // This instruction must list exactly one rule
      if (instructionArgs.split(/\s/)[0] !== ruleName) {
        return null;
      }

      try {
        config.value = JSON.parse(instructionArgs.slice(ruleName.length).trim());
        return config;
      } catch (e) {
        this.log({
          message: 'malformed template-lint-configure instruction',
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node)
        });
      }
    }

    return null;
  };

  BasePlugin.prototype._processLegacyConfigNode = function(node) {
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
      var i;

      // handle <!-- template-lint disabled=true -->
      if (key === 'disable' && value === 'true') {
        for (i = 0; i < this.configStack.length; i++) {
          this.configStack[i] = false;
        }
        this.config = false;
      }

      // handle <!-- template-lint block-indentation=false -->
      if (key === ruleName && value === 'false') {
        for (i = 0; i < this.configStack.length; i++) {
          this.configStack[i] = false;
        }
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

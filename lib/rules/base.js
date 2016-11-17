'use strict';

var _ = require('lodash');
var assign = _.assign;
var chalk = require('chalk');
var calculateLocationDisplay = require('../helpers/calculate-location-display');

// Constant to return from AST handlers so we know to remove/unregister them
var REMOVE_HANDLER = {};

// If we need to log an error or warning about an instruction node (e.g. syntax
// error), we want to only log it once, rather than having every rule log it,
// spamming the user. So the rules push any nodes with syntax errors into this
// array so only the first one will log the error, and subsequent rules will
// see it already in the array and not log it.
var loggedNodes = [];

var reLineEnds = /(?:\r\n?|\n)/;
var reWhitespace = /\s+/;
var reTree = /^(.*)-tree$/;
var reToggleRule = /^template-lint-(enable|disable)$/;

function unquote(str) {
  if (str.length < 3) {
    return str;
  }

  // Allow single or double quotes
  var firstLetter = str[0];
  var lastLetter = str[str.length - 1];
  if (firstLetter === lastLetter && ['"', '\''].indexOf(firstLetter) > -1) {
    return str.slice(1, -1);
  }
  return str;
}

module.exports = function(options) {
  var allRules = require('./index');
  var console = options.console || console;
  var log = options.log;
  var config = options.config;
  var ruleName = options.name;
  var defaultSeverity = options.defaultSeverity;

  // The `firstArg !== ruleName` check isn't strictly necessary, but allows
  // unit tests to register test rules
  function isRuleName(name) {
    return allRules[name] || name === ruleName;
  }

  function BasePlugin(options) {
    this.options = options;
    this.syntax = null; // set by Glimmer

    // split into a source array (allow windows and posix line endings)
    this.source = this.options.rawSource.split(reLineEnds);

    this._console = console;
    this._log = log;
    this.ruleName = ruleName;
    this.severity = defaultSeverity;
    // To support DOM-scoped configuration instructions, we need to maintain
    // a stack of our configurations so we can restore the previous one when
    // the current one goes out of scope. The current one is duplicated in
    // this.config so the rule implementations don't need to worry about the
    // fact that there is a stack.
    this.config = this.parseConfig(config);
    this._configStack = [this.config];
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

      if (loggedNodes.indexOf(node) === -1) {
        var locationInfo = calculateLocationDisplay(pluginContext.options.moduleName, {
          line: node.loc.start.line,
          column: node.loc.start.column
        });

        pluginContext._console.log(chalk.yellow([
          'HTML comment rule instructions are deprecated. ',
          'Please switch to Handlebars comments. ',
          '(' + locationInfo + ')\n',
          pluginContext.sourceForNode(node)
        ].join('')));
        loggedNodes.push(node);
      }

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
          return REMOVE_HANDLER;
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
              return REMOVE_HANDLER;
            }
          });
        } else {
          // Applies to only this element, so pop the config when we enter the
          // element's children, re-push it when we exit the element's
          // children, and then re-pop it when we exit the element entirely.
          // This is so that if the rule is listening for element exit events
          // for some reason, the configuration will be applied when they fire,
          // like it is applied when the enter events fire (but not applied when
          // entering/exiting or traversing the children).
          astHandlers.ElementNode.keys.children.enter.before.unshift(function(node) {
            if (node === elementNode) {
              pluginContext._popConfig(config.value);
              return REMOVE_HANDLER;
            }
          });
          astHandlers.ElementNode.keys.children.exit.after.push(function(node) {
            if (node === elementNode) {
              pluginContext._pushConfig(config.value);
              return REMOVE_HANDLER;
            }
          });
          astHandlers.ElementNode.exit.after.unshift(function(node) {
            if (node === elementNode) {
              pluginContext._popConfig(config.value);
              return REMOVE_HANDLER;
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
        if (ret === REMOVE_HANDLER) {
          beforeHandlers.splice(i, 1);
          i -= 1;
        }
      }

      if (ruleHandler && !plugin.isDisabled()) {
        ruleHandler.apply(plugin, arguments);
      }

      for (i = 0; i < afterHandlers.length; i++) {
        ret = afterHandlers[i].apply(plugin, arguments);
        if (ret === REMOVE_HANDLER) {
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
    this._configStack.push(config);
    this.config = config;
  };

  BasePlugin.prototype._popConfig = function(config) {
    if (_.last(this._configStack) !== config) {
      throw new Error('Configuration stack out of sync with AST!');
    }

    this._configStack.pop();
    this.config = _.last(this._configStack);
  };

  BasePlugin.prototype._processInstructionNode = function(node) {
    var nodeValue = node.value.trim();
    var instructionName = nodeValue.split(reWhitespace)[0];
    var instructionArgs = nodeValue.slice(instructionName.length + 1).trim();
    var config = { tree: false };
    var m;

    m = reTree.exec(instructionName);
    if (m) {
      config.tree = true;
      instructionName = m[1];
    }

    m = reToggleRule.exec(instructionName);
    if (m) {
      // If no instructionArgs, it's just disabling everything, so apply the
      // config
      if (instructionArgs) {
        // It includes an explicit list of rules, so not just disabling
        // everything. So, let's validate the rule names, and then see if it
        // contains us.
        var names = instructionArgs.split(reWhitespace).map(unquote);

        // Validate rule names. If one or more fail to validate, don't return,
        // though, because if we can still find our rule name in the list, we
        // can process the instruction just fine.
        if (loggedNodes.indexOf(node) === -1) {
          var badNames = names.filter(function(name) {
            return !isRuleName(name);
          });
          for (var i = 0; i < badNames.length; i++) {
            this.log({
              message: 'unrecognized rule name `' + badNames[i] + '` in ' + instructionName + ' instruction',
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
              rule: 'global'
            });
          }

          if (badNames.length > 0) {
            loggedNodes.push(node);
          }
        }

        if (names.indexOf(ruleName) === -1) {
          // Explicit list that doesn't include us
          return null;
        }
      }

      if (m[1] === 'disable') {
        config.value = false;
      } else {
        // Enable means set to the default config, i.e. the bottom of our
        // config stack...unless it was originally disabled, and then just
        // enable it.
        if (this._configStack[0] === false) {
          config.value = true;
        } else {
          config.value = this._configStack[0];
        }
      }

      return config;
    } else if (instructionName === 'template-lint-configure') {
      // This instruction must list exactly one rule
      var firstArg = instructionArgs.split(reWhitespace)[0];
      var jsonString = instructionArgs.slice(firstArg.length).trim();

      firstArg = unquote(firstArg);

      // Make sure the first argument is a valid rule name as a heuristic to
      // check for syntax errors.
      if (!isRuleName(firstArg)) {
        // Invalid rule
        if (loggedNodes.indexOf(node) === -1) {
          this.log({
            message: 'unrecognized rule name `' + firstArg + '` in template-lint-configure instruction',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
            rule: 'global'
          });
          loggedNodes.push(node);
        }
        return;
      }

      if (firstArg !== ruleName) {
        // Valid rule, but not us, so not relevant
        return null;
      }

      try {
        config.value = JSON.parse(jsonString);
        return config;
      } catch (e) {
        if (loggedNodes.indexOf(node) === -1) {
          this.log({
            message: 'malformed template-lint-configure instruction: `' + jsonString + '` is not valid JSON',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
            rule: 'global'
          });
          loggedNodes.push(node);
        }
      }
    } else if (instructionName.slice(0, 'template-lint'.length) === 'template-lint') {
      if (loggedNodes.indexOf(node) === -1) {
        this.log({
          message: 'unrecognized template-lint instruction: `' + instructionName + '`',
          line: node.loc && node.loc.start.line,
          column: node.loc && node.loc.start.column,
          source: this.sourceForNode(node),
          rule: 'global'
        });
        loggedNodes.push(node);
      }
    }

    return null;
  };

  BasePlugin.prototype._processLegacyConfigNode = function(node) {
    var hashParts = node.value
          .trim()
          .slice(14)
          .split(reWhitespace);

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
        for (i = 0; i < this._configStack.length; i++) {
          this._configStack[i] = false;
        }
        this.config = false;
      }

      // handle <!-- template-lint block-indentation=false -->
      if (key === ruleName && value === 'false') {
        for (i = 0; i < this._configStack.length; i++) {
          this._configStack[i] = false;
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

'use strict';

const DEPRECATED_RULES = require('../helpers/deprecated-rules');
const Scope = require('../helpers/scope');

// Constant to return from AST handlers so we know to remove/unregister them
const REMOVE_HANDLER = {};

const MODULE_NAME = Symbol('_moduleName');

// If we need to log an error or warning about an instruction node (e.g. syntax
// error), we want to only log it once, rather than having every rule log it,
// spamming the user. So the rules push any nodes with syntax errors into this
// array so only the first one will log the error, and subsequent rules will
// see it already in the array and not log it.
const loggedNodes = [];
const loggedRules = new Set();

const reLines = /(.*?(?:\r\n?|\n|$))/gm;
const reWhitespace = /\s+/;
const reTree = /^(.*)-tree$/;
const reToggleRule = /^template-lint-(enable|disable)$/;

function last(array) {
  return array[array.length - 1];
}

function unquote(str) {
  if (str.length < 3) {
    return str;
  }

  // Allow single or double quotes
  let firstLetter = str[0];
  let lastLetter = str[str.length - 1];
  if (firstLetter === lastLetter && ['"', "'"].includes(firstLetter)) {
    return str.slice(1, -1);
  }
  return str;
}

module.exports = class {
  constructor(options) {
    this.ruleName = options.name;
    this._console = options.console || console;
    this._configResolver = options.configResolver;
    this._ruleNames = options.ruleNames;
    this._allowInlineConfig =
      typeof options.allowInlineConfig === 'boolean' ? options.allowInlineConfig : true;

    this.severity = options.defaultSeverity;
    this.results = [];
    this.mode = options.shouldFix ? 'fix' : 'report';

    // To support DOM-scoped configuration instructions, we need to maintain
    // a stack of our configurations so we can restore the previous one when
    // the current one goes out of scope. The current one is duplicated in
    // this.config so the rule implementations don't need to worry about the
    // fact that there is a stack.
    this.config = this.parseConfig(options.config);
    this._configStack = [this.config];

    this.workingDir = options.workingDir;
    // TODO: add a deprecation for accessing _filePath
    this.filePath = this._filePath = options.filePath;
    this[MODULE_NAME] = options.moduleName;
    this._rawSource = options.rawSource;

    // split into a source array (allow windows and posix line endings)
    this.source = options.rawSource.match(reLines);
  }

  get editorConfig() {
    return this._configResolver.editorConfig();
  }

  get _moduleName() {
    throw new Error(
      `The \`_moduleName\` property used in the '${this.ruleName}' rule has been removed. Please use \`_filePath\` instead.`
    );
  }

  // The `name !== this.ruleName` check isn't strictly necessary, but allows
  // unit tests to register test rules
  _isRuleName(name) {
    return this._ruleNames.includes(name) || name === this.ruleName || DEPRECATED_RULES.has(name);
  }

  _refersToCurrentRule(name) {
    return name === this.ruleName || DEPRECATED_RULES.get(name) === this.ruleName;
  }

  parseConfig(config) {
    return config;
  }

  async getVisitor() {
    let pluginContext = this; // eslint-disable-line unicorn/no-this-assignment
    let visitor = {};
    let ruleVisitor = await this.visitor();
    // We use this structure to advise/unadvise on AST events. The walkers we
    // set up read this structure every time they get an AST event and call the
    // appropriate functions. Handlers get added to the before/after list
    // according to whether they will be called before/after the rule's AST
    // event handlers.
    let astHandlers = {
      Template: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] },
      },
      Block: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] },
      },
      CommentStatement: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] },
      },
      MustacheCommentStatement: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] },
      },
      BlockStatement: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] },
      },
      PathExpression: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] },
      },
      ElementNode: {
        enter: { before: [], after: [] },
        exit: { before: [], after: [] },
        keys: {
          children: {
            enter: { before: [], after: [] },
            exit: { before: [], after: [] },
          },
          comments: {
            enter: { before: [], after: [] },
            exit: { before: [], after: [] },
          },
        },
      },
    };
    // Keep a stack of ancestor elements so that when we encounter a comment
    // that is the child of an element (i.e. not within the element's tag)
    // we know what it's parent is so we can set up a listener for when we
    // leave the comment's siblings.
    let scope = (this.scope = new Scope());

    // We don't traverse in-element comments until after we've entered the
    // element, but we need to apply such instructions before we enter the
    // element. So, we have an element enter handler that processes that
    // element's comments, which means we need to distinguish in-element
    // comments from child-of-element comments during the traverse so we can
    // ignore the former, but still process the latter.
    let inElementComments = false;

    //
    // Wrap the visitor handlers supplied by the rule, plus make sure we have entries
    // for the handlers we use internally for instruction processing. This is
    // done for two reasons -- one is to support instruction processing, but
    // the other is to allow the rule's visitor handlers to have their this
    // context set to the plugin, which isn't what HTMLBars does.
    //
    for (let key in ruleVisitor) {
      visitor[key] = this._wrapVisitor(ruleVisitor[key], astHandlers[key]);
    }

    visitor.Template = visitor.Template || this._wrapVisitor(null, astHandlers.Template);
    visitor.Block = visitor.Block || this._wrapVisitor(null, astHandlers.Block);
    visitor.CommentStatement =
      visitor.CommentStatement || this._wrapVisitor(null, astHandlers.CommentStatement);
    visitor.MustacheCommentStatement =
      visitor.MustacheCommentStatement ||
      this._wrapVisitor(null, astHandlers.MustacheCommentStatement);
    visitor.PathExpression =
      visitor.PathExpression || this._wrapVisitor(null, astHandlers.PathExpression);
    visitor.BlockStatement =
      visitor.BlockStatement || this._wrapVisitor(null, astHandlers.BlockStatement);
    visitor.ElementNode = visitor.ElementNode || this._wrapVisitor(null, astHandlers.ElementNode);

    //
    // Set up our handlers
    //

    // Manage scope
    function pushFrame(node) {
      scope.pushFrame(node);
    }

    function popFrame() {
      scope.popFrame();
    }

    function localVariablesCatcher(node) {
      scope.useLocal(node);
    }

    astHandlers.PathExpression.enter.before.push(localVariablesCatcher);
    astHandlers.Template.enter.before.push(pushFrame);
    astHandlers.Template.exit.after.push(popFrame);

    astHandlers.Block.enter.before.push(pushFrame);
    astHandlers.Block.exit.after.push(popFrame);

    astHandlers.ElementNode.keys.children.enter.before.push(pushFrame, localVariablesCatcher);
    astHandlers.ElementNode.keys.children.exit.after.push(popFrame);

    // Manage inElementComments
    astHandlers.ElementNode.keys.comments.enter.before.push(function () {
      inElementComments = true;
    });
    astHandlers.ElementNode.keys.comments.exit.after.push(function () {
      if (!inElementComments) {
        throw new Error('Element comments state out of sync with AST!');
      }
      inElementComments = false;
    });

    // Handle element-child config statements
    astHandlers.MustacheCommentStatement.enter.after.push(function (commentNode) {
      if (inElementComments) {
        return;
      }

      let config = pluginContext._processInstructionNode(commentNode);
      if (!config) {
        return;
      }

      pluginContext._pushConfig(config.value);

      // Pop the config once we exit the comment's siblings
      let parentNode = scope.currentNode;
      astHandlers.ElementNode.keys.children.exit.before.unshift(function (elementNode) {
        if (elementNode === parentNode) {
          pluginContext._popConfig(config.value);
          return REMOVE_HANDLER;
        }
      });
    });

    // Handle in-element config statements
    astHandlers.ElementNode.enter.before.push(function (elementNode) {
      for (const commentNode of elementNode.comments) {
        let config = pluginContext._processInstructionNode(commentNode);
        if (!config) {
          continue;
        }

        pluginContext._pushConfig(config.value);

        if (config.tree) {
          // Applies to descendants, so pop the config once we exit the
          // comment's element
          astHandlers.ElementNode.exit.after.unshift(function (node) {
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
          astHandlers.ElementNode.keys.children.enter.before.unshift(function (node) {
            if (node === elementNode) {
              pluginContext._popConfig(config.value);
              return REMOVE_HANDLER;
            }
          });
          astHandlers.ElementNode.keys.children.exit.after.push(function (node) {
            if (node === elementNode) {
              pluginContext._pushConfig(config.value);
              return REMOVE_HANDLER;
            }
          });
          astHandlers.ElementNode.exit.after.unshift(function (node) {
            if (node === elementNode) {
              pluginContext._popConfig(config.value);
              return REMOVE_HANDLER;
            }
          });
        }
      }
    });

    return visitor;
  }

  visitor() {}

  // Generate a visitor handler function for a specific node type/event that
  // will call the internal handlers and the rule handler for that node
  // type/event in the correct order.
  _wrapVisitorHandler(ruleHandler, internalHandlers) {
    internalHandlers = internalHandlers || {};
    let beforeHandlers = internalHandlers.before || [];
    let afterHandlers = internalHandlers.after || [];
    let plugin = this; // eslint-disable-line unicorn/no-this-assignment
    let i, ret;

    return function () {
      let maybeRuleHandlerResult;

      for (i = 0; i < beforeHandlers.length; i++) {
        ret = beforeHandlers[i].apply(plugin, arguments); // eslint-disable-line prefer-rest-params
        if (ret === REMOVE_HANDLER) {
          beforeHandlers.splice(i, 1);
          i -= 1;
        }
      }

      if (ruleHandler && !plugin.isDisabled()) {
        maybeRuleHandlerResult = ruleHandler.apply(plugin, arguments); // eslint-disable-line prefer-rest-params
      }

      for (i = 0; i < afterHandlers.length; i++) {
        ret = afterHandlers[i].apply(plugin, arguments); // eslint-disable-line prefer-rest-params
        if (ret === REMOVE_HANDLER) {
          afterHandlers.splice(i, 1);
          i -= 1;
        }
      }

      if (maybeRuleHandlerResult !== undefined && plugin.mode === 'fix') {
        return maybeRuleHandlerResult;
      }
    };
  }

  // Give the rule's visitor for a given node type, and our internal
  // astHandlers registry for that node type, generate a visitor that will
  // call all the various event handlers in the proper order
  _wrapVisitor(ruleVisitor, astHandlers) {
    if (typeof ruleVisitor === 'function') {
      ruleVisitor = { enter: ruleVisitor };
    }

    ruleVisitor = ruleVisitor || {};
    astHandlers = astHandlers || {};

    let visitorKeys = ruleVisitor.keys || {};
    let visitorChildren = visitorKeys.children || {};
    let visitorComments = visitorKeys.comments || {};
    let internalKeys = astHandlers.keys || {};
    let internalChildren = internalKeys.children || {};
    let internalComments = internalKeys.comments || {};

    return {
      enter: this._wrapVisitorHandler(ruleVisitor.enter, astHandlers.enter),
      exit: this._wrapVisitorHandler(ruleVisitor.exit, astHandlers.exit),
      keys: {
        children: {
          enter: this._wrapVisitorHandler(visitorChildren.enter, internalChildren.enter),
          exit: this._wrapVisitorHandler(visitorChildren.exit, internalChildren.exit),
        },
        comments: {
          enter: this._wrapVisitorHandler(visitorComments.enter, internalComments.enter),
          exit: this._wrapVisitorHandler(visitorComments.exit, internalComments.exit),
        },
      },
    };
  }

  _pushConfig(config) {
    this._configStack.push(config);
    this.config = config;
  }

  _popConfig(config) {
    if (last(this._configStack) !== config) {
      throw new Error('Configuration stack out of sync with AST!');
    }

    this._configStack.pop();
    this.config = last(this._configStack);
  }

  _processInstructionNode(node) {
    if (!this._allowInlineConfig) {
      // inline configuration is disabled, do nothing
      return null;
    }

    let nodeValue = node.value.trim();
    let instructionName = nodeValue.split(reWhitespace)[0];
    let instructionArgs = nodeValue.slice(instructionName.length + 1).trim();
    let config = { tree: false };
    let m;

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
        let names = instructionArgs.split(reWhitespace).map(unquote);

        // Validate rule names. If one or more fail to validate, don't return,
        // though, because if we can still find our rule name in the list, we
        // can process the instruction just fine.
        if (!loggedNodes.includes(node)) {
          let badNames = names.filter((name) => !this._isRuleName(name));

          for (const badName of badNames) {
            this.log({
              message: `unrecognized rule name \`${badName}\` in ${instructionName} instruction`,
              node,
              rule: 'global',
            });
          }

          if (badNames.length > 0) {
            loggedNodes.push(node);
          }
        }

        if (names.every((name) => !this._refersToCurrentRule(name))) {
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
      let firstArg = instructionArgs.split(reWhitespace)[0];
      let jsonString = instructionArgs.slice(firstArg.length).trim();

      firstArg = unquote(firstArg);

      // Make sure the first argument is a valid rule name as a heuristic to
      // check for syntax errors.
      if (!this._isRuleName(firstArg)) {
        // Invalid rule
        if (!loggedNodes.includes(node)) {
          this.log({
            message: `unrecognized rule name \`${firstArg}\` in template-lint-configure instruction`,
            node,
            rule: 'global',
          });
          loggedNodes.push(node);
        }
        return null;
      }

      if (!this._refersToCurrentRule(firstArg)) {
        // Valid rule, but not us, so not relevant
        return null;
      }

      try {
        const { determineRuleConfig } = require('../get-config');
        config.value = JSON.parse(jsonString);
        let ruleData = determineRuleConfig(config.value);
        this.severity = ruleData.severity;
        return config;
      } catch {
        if (!loggedNodes.includes(node)) {
          this.log({
            message: `malformed template-lint-configure instruction: \`${jsonString}\` is not valid JSON`,
            node,
            rule: 'global',
          });
          loggedNodes.push(node);
        }
      }
    } else if (instructionName.slice(0, 'template-lint'.length) === 'template-lint') {
      if (!loggedNodes.includes(node)) {
        this.log({
          message: `unrecognized template-lint instruction: \`${instructionName}\``,
          node,
          rule: 'global',
        });
        loggedNodes.push(node);
      }
    }

    return null;
  }

  isDisabled() {
    return !this.config;
  }

  log(result) {
    let nodeProps = {};
    let defaults = {
      rule: this.ruleName,
      severity: this.severity,
    };
    let hasAllLocProps = ['line', 'column', 'endLine', 'endColumn'].every((prop) => prop in result);

    if (this.filePath) {
      defaults.filePath = this.filePath;
    }

    if (!result.node && !hasAllLocProps) {
      if (!loggedRules.has(this.ruleName)) {
        let message = `ember-template-lint: (${this.ruleName}) Calling the log method without passing all required loc (line, column, endLine, endColumn)
properties or the node property is deprecated. Please ensure you pass either the loc properties or the node in the log method's result.`;

        if (process.env.EMBER_TEMPLATE_LINT_DEV_MODE === '1') {
          throw new Error(message);
        } else {
          this._console.log(message);

          loggedRules.add(this.ruleName);
        }
      }
    }

    // perform the node property expansion only if those properties don't exist in result
    if (!hasAllLocProps && result.node) {
      let node = result.node;
      delete result.node;
      // if we've passed node, we want to ensure that we're correctly expanding the properties
      // to include line, column, and source. If the rule has passed custom values for these,
      // we want to respect those.
      nodeProps = {
        line: 'line' in result ? result.line : node.loc && node.loc.start.line,
        column: 'column' in result ? result.column : node.loc && node.loc.start.column,
        endLine: 'endLine' in result ? result.endLine : node.loc && node.loc.end.line,
        endColumn: 'endColumn' in result ? result.endColumn : node.loc && node.loc.end.column,
        source: 'source' in result ? result.source : this.sourceForNode(node),
      };
    }

    let reportedResult = Object.assign({}, defaults, nodeProps, result);

    this.results.push(reportedResult);
  }

  detect() {
    throw new Error('Must implemented #detect');
  }

  process() {
    throw new Error('Must implemented #process');
  }

  // mostly copy/pasta from tildeio/htmlbars with a few tweaks:
  // https://github.com/tildeio/htmlbars/blob/v0.14.17/packages/htmlbars-syntax/lib/parser.js#L59-L90
  sourceForNode(node) {
    if (node.loc) {
      return this.sourceForLoc(node.loc);
    }
  }

  sourceForLoc(loc) {
    let firstLine = loc.start.line - 1;
    let lastLine = loc.end.line - 1;
    let currentLine = firstLine - 1;
    let firstColumn = loc.start.column;
    let lastColumn = loc.end.column;
    let string = [];
    let line;

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

    return string.join('');
  }

  isLocal(node) {
    return this.scope.isLocal(node);
  }
};

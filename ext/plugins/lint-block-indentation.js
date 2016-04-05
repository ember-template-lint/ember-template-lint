'use strict';

/*
 Forces valid indentation for blocks and their children.

 1. Forces block begin and block end statements to be at the same indentation
    level, when not on one line.

 ```hbs
 {{! good }}
 {{#each foo as |bar|}}
 {{/each}}

 <div>
   <p>{{t "greeting"}}</p>
 </div>

 {{! bad }}
 {{#each foo as |bar|}}
   {{/each}}

 <div>
  <p>{{t "greeting"}}</p>
 </div>
 ```

 2. Forces children of all blocks to start at a single indentation level deeper.
    Configuration is available to specify various indentation levels.


 ```
 {{! good }}
 <div>
   <p>{{t "greeting"}}</p>
 </div>

 {{! bad }}
 <div>
  <p>{{t "greeting"}}</p>
 </div>
 ```

 The following values are valid configuration:

 * boolean -- `true` indicates a 2 space indent, `false` indicates that the rule is disabled.
 * numeric -- the number of spaces to require for indentation
 * "tab" -- To indicate tab style indentation (1 char)

 */

var calculateLocationDisplay = require('../helpers/calculate-location-display');
var buildPlugin = require('./base');
var VOID_TAGS = { area: true,
                  base: true,
                  br: true,
                  col: true,
                  command: true,
                  embed: true,
                  hr: true,
                  img: true,
                  input: true,
                  keygen: true,
                  link: true,
                  meta: true,
                  param: true,
                  source: true,
                  track: true,
                  wbr: true };

function childrenFor(node) {
  if (node.type === 'Program') {
    return node.body;
  }
  if (node.type === 'BlockStatement') {
    return node.program.body;
  }
  if (node.type === 'ElementNode') {
    return node.children;
  }
}

module.exports = function(addonContext) {
  var BlockIndentation = buildPlugin(addonContext, 'block-indentation');

  BlockIndentation.prototype.parseConfig = function(config) {
    var configType = typeof config;

    var errorMessage = 'The block-indentation rule accepts one of the following values.\n ' +
          '  * boolean - `true` to enable 2 space indentation\n' +
          '  * numeric - the number of spaces to require\n' +
          '  * `"tab" - usage of one character indentation (tab char)\n`' +
          '\nYou specified `' + config + '`';

    switch (configType) {
    case 'number':
      return config;
    case 'boolean':
      return config ? 2 : false;
    case 'string':
      if (config === 'tab') {
        return 1;
      } else {
        throw new Error(errorMessage);
      }
    case 'undefined':
      return false;
    default:
      throw new Error(errorMessage);
    }
  };

  BlockIndentation.prototype.detect = function(node) {
    return node.type === 'BlockStatement' || node.type === 'ElementNode';
  };

  /*eslint no-unused-expressions: 0*/
  BlockIndentation.prototype.process = function(node) {
    this.validateBlockEnd(node);
    this.validateBlockChildren(node);
  },

  BlockIndentation.prototype.validateBlockEnd = function(node) {
    // HTML elements that start and end on the same line are fine
    if (node.loc.start.line === node.loc.end.line) {
      return;
    }

    // do not validate indentation on VOID_TAG's
    if (VOID_TAGS[node.tag]) {
      return;
    }

    var isElementNode = node.type === 'ElementNode';
    var openCloseCharOffset = isElementNode ? 3 : 5;
    var displayName = isElementNode ? node.tag : node.path.original;
    var display = isElementNode ? '</' + displayName + '>' : '{{/' + displayName + '}}';
    var startColumn = node.loc.start.column;
    var endColumn   = node.loc.end.column;

    if (this.detectNestedElseBlock(node)) {
      this.processNestedElseBlock(node);
    }

    var startOffset = node._startOffset || 0;
    var correctedEndColumn = endColumn - displayName.length - openCloseCharOffset + startOffset;
    if(correctedEndColumn !== startColumn) {
      var startLocation = calculateLocationDisplay(this.options.moduleName, node.loc && node.loc.start);
      var endLocation = calculateLocationDisplay(this.options.moduleName, node.loc && node.loc.end);

      var warning = 'Incorrect indentation for `' + displayName + '` beginning at ' + startLocation +
            '. Expected `' + display + '` ending at ' + endLocation + ' to be at an indentation of ' + startColumn + ' but ' +
            'was found at ' + correctedEndColumn + '.';
      this.log(warning);
    }
  };

  BlockIndentation.prototype.validateBlockChildren = function(node) {
    var children = childrenFor(node);

    if (!children || !children.length) {
      return;
    }

    // HTML elements that start and end on the same line are fine
    if (node.loc.start.line === node.loc.end.line) {
      return;
    }

    var startColumn = node.loc.start.column;
    var expectedStartColumn = startColumn + this.config;

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (!child.loc) { continue; }

      // We might not actually be the first thing on the line. We might be
      // preceded by another element or statement, or by some text. So walk
      // backwards looking for something else on this line.
      var hasLeadingContent = false;
      for (var j = i - 1; j >= 0; j--) {
        var sibling = children[j];
        if (sibling.loc) {
          // Found an element or statement. If it's on this line, then we
          // have leading content, so set the flag and break. If it's not
          // on this line, then we've scanned back to a previous line, so
          // we can also break.
          if (sibling.loc.end.line === child.loc.start.line) {
            hasLeadingContent = true;
          }
          break;
        } else {
          var lines = sibling.chars.split(/[\r\n]/);
          var lastLine = lines[lines.length - 1];
          if (lastLine.trim()) {
            // The last line in this text node has non-whitespace content, so
            // set the flag.
            hasLeadingContent = true;
          }
          if (lines.length > 1) {
            // There are multiple lines meaning we've now scanned back to a
            // previous line, so we can break.
            break;
          }
        }
      }

      if (hasLeadingContent) {
        // There's content before us on the same line, so we don't care about
        // our column.
        continue;
      }

      var childStartColumn = child.loc.start.column;
      if (expectedStartColumn !== childStartColumn) {
        var isElementNode = child.type === 'ElementNode';
        var displayName = isElementNode ? child.tag : child.path.original;
        var display;

        if (isElementNode) {
          display = '<' + displayName + '>';
        } else if (child.type === 'BlockStatement'){
          display = '{{#' + displayName + '}}';
        } else if (child.type === 'MustacheStatement') {
          display = '{{' + displayName + '}}';
        } else {
          display = displayName;
        }

        var startLocation = calculateLocationDisplay(this.options.moduleName, child.loc && child.loc.start);

        var warning = 'Incorrect indentation for `' + display + '` beginning at ' + startLocation +
            '. Expected `' + display + '` to be at an indentation of ' + expectedStartColumn + ' but ' +
            'was found at ' + childStartColumn + '.';
        this.log(warning);
      }
    }
  };

  BlockIndentation.prototype.detectNestedElseBlock = function(node) {
    var inverse = node.inverse;
    var firstItem = inverse && inverse.body[0];

    // handle `{{else if foo}}`
    if (inverse && firstItem && firstItem.type === 'BlockStatement') {
      return inverse.loc.start.line === firstItem.loc.start.line &&
        inverse.loc.start.column === firstItem.loc.start.column;
    }

    return false;
  };

  BlockIndentation.prototype.processNestedElseBlock = function(node) {
    var elseBlockStatement = node.inverse.body[0];

    elseBlockStatement._startOffset = 5 + elseBlockStatement.path.original.length;
  };

  return BlockIndentation;
};

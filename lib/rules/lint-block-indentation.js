'use strict';

var AstNodeInfo = require('../helpers/ast-node-info');

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

var buildPlugin = require('./base');
var VALID_FOLLOWING_CHARS = [' ', '>', '}', '~'];
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

  BlockIndentation.prototype.visitors = function() {
    return {
      BlockStatement: function(node) {
        this.process(node);
      },

      ElementNode: function(node) {
        this.process(node);
      }
    };
  };

  /*eslint no-unused-expressions: 0*/
  BlockIndentation.prototype.process = function(node) {
    this.validateBlockElse(node);
    this.validateBlockEnd(node);
    this.validateBlockChildren(node);
  },

  BlockIndentation.prototype.validateBlockEnd = function(node) {
    if (!this.shouldValidateBlockEnd(node)) {
      return;
    }

    var isElementNode = AstNodeInfo.isElementNode(node);
    var displayName = isElementNode ? node.tag : node.path.original;
    var display = isElementNode ? '</' + displayName + '>' : '{{/' + displayName + '}}';
    var startColumn = node.loc.start.column;
    var endColumn   = node.loc.end.column;

    var startOffset = this.startOffsetFor(node);
    var controlCharCount = this.endingControlCharCount(node);
    var correctedEndColumn = endColumn - displayName.length - controlCharCount + startOffset;

    if(correctedEndColumn !== startColumn) {
      var startLocation = 'L' + node.loc.start.line + ':C' + node.loc.start.column;
      var endLocation = 'L' + node.loc.end.line + ':C' + node.loc.end.column;

      var warning = 'Incorrect indentation for `' + displayName + '` beginning at ' + startLocation +
            '. Expected `' + display + '` ending at ' + endLocation + ' to be at an indentation of ' + startColumn + ' but ' +
            'was found at ' + correctedEndColumn + '.';

      this.log({
        message: warning,
        line: node.loc.end.line,
        column: node.loc.end.column,
        source: this.sourceForNode(node)
      });
    }
  };

  BlockIndentation.prototype.validateBlockChildren = function(node) {
    var children = AstNodeInfo.childrenFor(node);

    if (!AstNodeInfo.hasChildren(node)) {
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
        if (sibling.loc && !AstNodeInfo.isTextNode(sibling)) {
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

      // sanitize text node starting column info
      if (AstNodeInfo.isTextNode(child)) {
        // TextNode's include leading newlines, but those newlines do
        // not get used in calculating indentation
        var withoutLeadingNewLines = child.chars.replace(/^(\r\n|\n)*/, '');
        var firstNonWhitespace = withoutLeadingNewLines.search(/\S/);

        // the TextNode is whitespace only, do nothing
        if (firstNonWhitespace === -1) { continue; }

        // reset the child start column if there's a line break
        if (/^(\r\n|\n)/.test(child.chars)) { childStartColumn = 0; }

        childStartColumn += firstNonWhitespace;

        // detect if the TextNode starts with `{{`, if it does
        // correct for the stripped leading backslash (`\{{foo}}`)
        if (withoutLeadingNewLines.slice(0, 2) === '{{') {
          childStartColumn -= 1;
        }
      }

      if (expectedStartColumn !== childStartColumn) {
        var isElementNode = AstNodeInfo.isElementNode(child);
        var display;

        if (isElementNode) {
          display = '<' + child.tag + '>';
        } else if (AstNodeInfo.isBlockStatement(child)){
          display = '{{#' + child.path.original + '}}';
        } else if (AstNodeInfo.isMustacheStatement(child)) {
          display = '{{' + child.path.original + '}}';
        } else if (AstNodeInfo.isTextNode(child)) {
          display = child.chars;
        } else if (AstNodeInfo.isCommentStatement(child)) {
          display = '<!--' + child.value + '-->';
        } else if (AstNodeInfo.isMustacheCommentStatement(child)) {
          display = '{{!' + child.value + '}}';
        } else {
          display = child.path.original;
        }

        var startLocation = 'L' + child.loc.start.line + ':C' + child.loc.start.column;
        var warning = 'Incorrect indentation for `' + display + '` beginning at ' + startLocation +
            '. Expected `' + display + '` to be at an indentation of ' + expectedStartColumn + ' but ' +
            'was found at ' + childStartColumn + '.';

        this.log({
          message: warning,
          line: child.loc && child.loc.start.line,
          column: child.loc && child.loc.start.column,
          source: this.sourceForNode(node)
        });
      }
    }
  };

  BlockIndentation.prototype.validateBlockElse = function(node) {
    if (!AstNodeInfo.isBlockStatement(node) || !node.inverse) {
      return;
    }

    if (this.detectNestedElseIfBlock(node)) {
      this.processNestedElseIfBlock(node);
    }

    var inverse = node.inverse;
    var startColumn = node.loc.start.column;
    var elseStartColumn = inverse.loc.start.column;

    if(elseStartColumn !== startColumn) {
      var displayName = node.path.original;
      var startLocation = 'L' + node.loc.start.line + ':C' + node.loc.start.column;
      var elseLocation = 'L' + inverse.loc.start.line + ':C' + inverse.loc.start.column;

      var warning = 'Incorrect indentation for inverse block of `{{#' + displayName + '}}` beginning at ' + startLocation +
            '. Expected `{{else}}` starting at ' + elseLocation + ' to be at an indentation of ' + startColumn + ' but ' +
            'was found at ' + elseStartColumn + '.';

      this.log({
        message: warning,
        line: inverse.loc.start.line,
        column: inverse.loc.start.column,
        source: this.sourceForNode(node.inverse)
      });
    }
  };

  BlockIndentation.prototype.detectNestedElseIfBlock = function(node) {
    var inverse = node.inverse;
    var firstItem = inverse && inverse.body[0];

    // handle `{{else if foo}}`
    if (inverse && firstItem && AstNodeInfo.isBlockStatement(firstItem)) {
      return inverse.loc.start.line === firstItem.loc.start.line &&
        inverse.loc.start.column === firstItem.loc.start.column;
    }

    return false;
  };

  BlockIndentation.prototype.processNestedElseIfBlock = function(node) {
    var elseBlockStatement = node.inverse.body[0];

    elseBlockStatement._startOffset = 5 + elseBlockStatement.path.original.length;
  };

  BlockIndentation.prototype.startOffsetFor = function(node) {
    return node._startOffset || 0;
  };

  BlockIndentation.prototype.shouldValidateBlockEnd = function(node) {
    // HTML elements that start and end on the same line are fine
    if (node.loc.start.line === node.loc.end.line) {
      return false;
    }

    // do not validate indentation on VOID_TAG's
    if (VOID_TAGS[node.tag]) {
      return false;
    }

    // do not validate nodes without children (whitespace will count as TextNodes)
    if (AstNodeInfo.isElementNode(node)) {
      return AstNodeInfo.hasChildren(node);
    }

    var source = this.sourceForNode(node);
    var endingToken = '/' + node.path.original;
    var indexOfEnding = source.lastIndexOf(endingToken);

    // Do not validate if source doesn't match node (if vs iframe)
    var charAfterEnding = source[indexOfEnding + endingToken.length];
    if (indexOfEnding !== -1 && VALID_FOLLOWING_CHARS.indexOf(charAfterEnding) === -1) {
      return false;
    }

    return indexOfEnding !== -1;
  };

  BlockIndentation.prototype.endingControlCharCount = function(node) {
    if (AstNodeInfo.isElementNode(node)) {
      // </>
      return 3;
    }

    var source = this.sourceForNode(node);
    var endingToken = '/' + node.path.original;
    var indexOfEnding = source.lastIndexOf(endingToken);

    var leadingControlCharCount = 0;
    var i = indexOfEnding - 1;

    while (isControlChar(source[i])) {
      leadingControlCharCount++;
      i--;
    }

    var trailingControlCharCount = 0;
    i = indexOfEnding + endingToken.length;

    while (isControlChar(source[i])) {
      trailingControlCharCount++;
      i++;
    }

    var closingSlash = 1;

    return leadingControlCharCount + closingSlash + trailingControlCharCount;
  };

  function isControlChar(char) {
    return char === '~' || char === '{' || char === '}';
  }

  return BlockIndentation;
};

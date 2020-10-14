'use strict';

/*
 Forces valid indentation for blocks and their children.

 1. Forces block begin and block end statements to be at the same indentation
    level, when not on one line.

 ```hbs
 {{!-- good  --}}
 {{#each foo as |bar|}}
 {{/each}}

 <div>
   <p>{{t "greeting"}}</p>
 </div>

 {{!-- bad  --}}
 {{#each foo as |bar|}}
   {{/each}}

 <div>
  <p>{{t "greeting"}}</p>
 </div>
 ```

 2. Forces children of all blocks to start at a single indentation level deeper.
    Configuration is available to specify various indentation levels.


 ```
 {{!-- good  --}}
 <div>
   <p>{{t "greeting"}}</p>
 </div>

 {{!-- bad  --}}
 <div>
  <p>{{t "greeting"}}</p>
 </div>
 ```

 The following values are valid configuration:

 * boolean -- `true` indicates a 2 space indent, `false` indicates that the rule is disabled.
 * numeric -- the number of spaces to require for indentation
 * "tab" -- To indicate tab style indentation (1 char)
 * object --
 *    `indentation: <numeric>` - number of spaces to indent (defaults to 2)',
      `ignoreComments: <boolean>` - skip indentation for comments (defaults to `false`)',
 */

const assert = require('assert');

const AstNodeInfo = require('../helpers/ast-node-info');
const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./base');

const VALID_FOLLOWING_CHARS = new Set([' ', '>', '}', '~']);
const VOID_TAGS = {
  area: true,
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
  wbr: true,
};
const IGNORED_ELEMENTS = new Set(['pre', 'script', 'style', 'template', 'textarea']);

function isControlChar(char) {
  return char === '~' || char === '{' || char === '}';
}

module.exports = class BlockIndentation extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    let defaultConfig = {
      indentation: 2,
    };

    const editorIndentation = this.editorConfig['indent_size'];
    if (typeof editorIndentation === 'number') {
      defaultConfig.indentation = editorIndentation;
    }

    switch (configType) {
      case 'number':
        return {
          indentation: config,
        };
      case 'boolean':
        if (config) {
          return defaultConfig;
        } else {
          return {};
        }
      case 'string':
        if (config === 'tab') {
          return {
            indentation: 1,
          };
        }
        break;
      case 'object': {
        let result = defaultConfig;

        if ('ignoreComments' in config) {
          let ignoreComments = config.ignoreComments;

          assert(
            typeof ignoreComments === 'boolean',
            'Unexpected value for ignoreComments. `ignoreComments` should be a boolean`'
          );

          result.ignoreComments = ignoreComments;
        }

        if ('indentation' in config) {
          let indentation = config.indentation;

          assert(
            typeof indentation === 'number',
            'Unexpected value for indentation. `indentation` should be a number.'
          );

          result.indentation = indentation;
        }

        return result;
      }
      case 'undefined':
        return {};
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable 2 space indentation',
        '  * numeric - the number of spaces to require',
        '  * "tab" - usage of one character indentation (tab char)',
        '  * object - An object with the following keys:',
        '    * `indentation: <numeric>` - number of spaces to indent (defaults to 2)',
        '    * `ignoreComments: <boolean>` - skip comment indentation (defaults to `false`)',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    this._elementStack = [];

    return {
      BlockStatement(node) {
        this.process(node);
      },

      ElementNode: {
        enter(node) {
          this._elementStack.push(node);

          this.process(node);
        },
        exit() {
          this._elementStack.pop();
        },
      },
    };
  }

  process(node) {
    // Nodes that start and end on the same line cannot have any indentation
    // issues (since the column of the start block was already checked in the
    // parent's validateBlockChildren())
    if (node.loc.start.line === node.loc.end.line) {
      return;
    }

    this.validateBlockStart(node);
    this.validateBlockElse(node);
    this.validateBlockEnd(node);
    this.validateBlockChildren(node);
  }

  validateBlockStart(node) {
    if (!this.shouldValidateBlockEnd(node)) {
      return;
    }

    if (this.isWithinIgnoredElement()) {
      return;
    }

    let startColumn = node.loc.start.column;
    let startLine = node.loc.start.line;

    if (startLine === 1 && startColumn !== 0) {
      let isElementNode = AstNodeInfo.isElementNode(node);
      let displayName = isElementNode ? node.tag : node.path.original;
      let display = isElementNode ? `<${displayName}>` : `{{#${displayName}}}`;
      let startLocation = `L${node.loc.start.line}:C${node.loc.start.column}`;

      let warning =
        `Incorrect indentation for \`${display}\` beginning at ${startLocation}. ` +
        `Expected \`${display}\` to be at an indentation of 0, but was found at ${startColumn}.`;

      this.log({
        message: warning,
        line: node.loc.start.line,
        column: node.loc.start.column,
        source: this.sourceForNode(node),
      });
    }
  }

  validateBlockEnd(node) {
    if (!this.shouldValidateBlockEnd(node)) {
      return;
    }

    if (this.isWithinIgnoredElement()) {
      return;
    }

    let isElementNode = AstNodeInfo.isElementNode(node);
    let displayName = isElementNode ? node.tag : node.path.original;
    let display = isElementNode ? `</${displayName}>` : `{{/${displayName}}}`;
    let startColumn = node.loc.start.column;
    let endColumn = node.loc.end.column;

    let controlCharCount = this.endingControlCharCount(node);
    let correctedEndColumn = endColumn - displayName.length - controlCharCount;

    if (correctedEndColumn !== startColumn) {
      let startLocation = `L${node.loc.start.line}:C${node.loc.start.column}`;
      let endLocation = `L${node.loc.end.line}:C${node.loc.end.column}`;

      let warning =
        `Incorrect indentation for \`${displayName}\` beginning at ${startLocation}` +
        `. Expected \`${display}\` ending at ${endLocation} to be at an indentation of ${startColumn} but ` +
        `was found at ${correctedEndColumn}.`;

      this.log({
        message: warning,
        line: node.loc.end.line,
        column: node.loc.end.column,
        source: this.sourceForNode(node),
      });
    }
  }

  // eslint-disable-next-line complexity
  validateBlockChildren(node) {
    if (this.isWithinIgnoredElement()) {
      return;
    }

    let children = AstNodeInfo.childrenFor(node).filter((x) => !x._isElseIfBlock);

    if (!AstNodeInfo.hasChildren(node)) {
      return;
    }

    // HTML elements that start and end on the same line are fine
    if (node.loc.start.line === node.loc.end.line) {
      return;
    }

    let startColumn = node.loc.start.column;
    let expectedStartColumn = startColumn + this.config.indentation;

    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      if (!child.loc) {
        continue;
      }

      if (
        this.config.ignoreComments &&
        (AstNodeInfo.isCommentStatement(child) || AstNodeInfo.isMustacheCommentStatement(child))
      ) {
        break;
      }

      // We might not actually be the first thing on the line. We might be
      // preceded by another element or statement, or by some text. So walk
      // backwards looking for something else on this line.
      let hasLeadingContent = false;
      for (let j = i - 1; j >= 0; j--) {
        let sibling = children[j];
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
          let lines = sibling.chars.split(/[\n\r]/);
          let lastLine = lines[lines.length - 1];
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

      let childStartColumn = child.loc.start.column;
      let childStartLine = child.loc.start.line;

      // sanitize text node starting column info
      if (AstNodeInfo.isTextNode(child)) {
        // TextNode's include leading newlines, but those newlines do
        // not get used in calculating indentation
        let withoutLeadingNewLines = child.chars.replace(/^(\r\n|\n)*/, '');
        let firstNonWhitespace = withoutLeadingNewLines.search(/\S/);

        // the TextNode is whitespace only, do nothing
        if (firstNonWhitespace === -1) {
          continue;
        }

        // reset the child start column if there's a line break
        if (/^(\r\n|\n)/.test(child.chars)) {
          childStartColumn = 0;
          let newLineLength = child.chars.length - withoutLeadingNewLines.length;
          let leadingNewLines = child.chars.slice(newLineLength);
          childStartLine += (leadingNewLines.match(/\n/g) || []).length;
        }

        childStartColumn += firstNonWhitespace;

        // detect if the TextNode starts with `{{`, if it does
        // correct for the stripped leading backslash (`\{{foo}}`)
        if (withoutLeadingNewLines.slice(0, 2) === '{{') {
          childStartColumn -= 1;
        }
      }

      if (expectedStartColumn !== childStartColumn) {
        let isElementNode = AstNodeInfo.isElementNode(child);
        let display;

        if (isElementNode) {
          display = `<${child.tag}>`;
        } else if (AstNodeInfo.isBlockStatement(child)) {
          display = `{{#${child.path.original}}}`;
        } else if (AstNodeInfo.isMustacheStatement(child)) {
          display = `{{${child.path.original}}}`;
        } else if (AstNodeInfo.isTextNode(child)) {
          display = child.chars.replace(/^\s*/, '');
        } else if (AstNodeInfo.isCommentStatement(child)) {
          display = `<!--${child.value}-->`;
        } else if (AstNodeInfo.isMustacheCommentStatement(child)) {
          display = `{{!${child.value}}}`;
        } else {
          display = child.path.original;
        }

        let startLocation = `L${childStartLine}:C${childStartColumn}`;
        let warning =
          `Incorrect indentation for \`${display}\` beginning at ${startLocation}` +
          `. Expected \`${display}\` to be at an indentation of ${expectedStartColumn} but ` +
          `was found at ${childStartColumn}.`;

        this.log({
          message: warning,
          line: childStartLine,
          column: childStartColumn,
          source: this.sourceForNode(node),
        });
      }
    }
  }

  validateBlockElse(node) {
    if (!AstNodeInfo.isBlockStatement(node) || !node.inverse) {
      return;
    }

    if (this.detectNestedElseIfBlock(node)) {
      let elseBlockStatement = node.inverse.body[0];

      elseBlockStatement._isElseIfBlock = true;
    }

    let inverse = node.inverse;
    let startColumn = node.loc.start.column;
    let elseStartColumn = node.program.loc.end.column;

    if (elseStartColumn !== startColumn) {
      let displayName = node.path.original;
      let startLocation = `L${node.loc.start.line}:C${node.loc.start.column}`;
      let elseLocation = `L${inverse.loc.start.line}:C${elseStartColumn}`;

      let warning =
        `Incorrect indentation for inverse block of \`{{#${displayName}}}\` beginning at ${startLocation}` +
        `. Expected \`{{else}}\` starting at ${elseLocation} to be at an indentation of ${startColumn} but ` +
        `was found at ${elseStartColumn}.`;

      this.log({
        message: warning,
        line: inverse.loc.start.line,
        column: elseStartColumn,
        source: this.sourceForNode(node),
      });
    }
  }

  detectNestedElseIfBlock(node) {
    let inverse = node.inverse;
    let firstItem = inverse && inverse.body[0];

    // handle `{{else if foo}}`
    if (inverse && firstItem && AstNodeInfo.isBlockStatement(firstItem)) {
      return (
        inverse.loc.start.line === firstItem.loc.start.line &&
        // as of glimmer-vm@0.24.0 the firstItem of a nested else if block
        // actually starts _before_ its parent's `start` O_o
        inverse.loc.start.column > firstItem.loc.start.column
      );
    }

    return false;
  }

  shouldValidateBlockEnd(node) {
    if (node._isElseIfBlock) {
      return false;
    }

    // do not validate indentation on VOID_TAG's
    if (VOID_TAGS[node.tag]) {
      return false;
    }

    if (this.isWithinIgnoredElement()) {
      return;
    }

    // do not validate nodes without children (whitespace will count as TextNodes)
    if (AstNodeInfo.isElementNode(node)) {
      return AstNodeInfo.hasChildren(node);
    }

    let source = this.sourceForNode(node);
    let endingToken = `/${node.path.original}`;
    let indexOfEnding = source.lastIndexOf(endingToken);

    // Do not validate if source doesn't match node (if vs iframe)
    let charAfterEnding = source[indexOfEnding + endingToken.length];
    if (indexOfEnding !== -1 && !VALID_FOLLOWING_CHARS.has(charAfterEnding)) {
      return false;
    }

    return indexOfEnding !== -1;
  }

  endingControlCharCount(node) {
    if (AstNodeInfo.isElementNode(node)) {
      // </>
      return 3;
    }

    let source = this.sourceForNode(node);
    let endingToken = `/${node.path.original}`;
    let indexOfEnding = source.lastIndexOf(endingToken);

    let leadingControlCharCount = 0;
    let i = indexOfEnding - 1;

    while (isControlChar(source[i])) {
      leadingControlCharCount++;
      i--;
    }

    let trailingControlCharCount = 0;
    i = indexOfEnding + endingToken.length;

    while (isControlChar(source[i])) {
      trailingControlCharCount++;
      i++;
    }

    let closingSlash = 1;

    return leadingControlCharCount + closingSlash + trailingControlCharCount;
  }

  isWithinIgnoredElement() {
    return this._elementStack.some((n) => IGNORED_ELEMENTS.has(n.tag));
  }
};

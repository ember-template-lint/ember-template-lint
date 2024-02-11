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

import { parse, sourceForLoc } from 'ember-template-recast';
import assert from 'node:assert';

import AstNodeInfo from '../helpers/ast-node-info.js';
import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

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

/**
 * This function allows to get a node inside a node given a path
 *
 * @param {Node} node
 * @param {String[]} path - A list of property to search for in the node
 * @returns {Node}
 *
 * @example
 *   get(node, ['program', 'body', 1]) === node.program.body[1]
 */
function get(node, path) {
  let value = node;

  if (path) {
    for (const property of path) {
      value = value[property];
    }
  }

  return value;
}

function addWhitespaceEnd(str, count) {
  return `${str}${' '.repeat(count)}`;
}

function removeWhitespaceEnd(str, count) {
  return str.replace(new RegExp(` {${count}}$`), '');
}

export default class BlockIndentation extends Rule {
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
      case 'number': {
        return {
          indentation: config,
        };
      }
      case 'boolean': {
        if (config) {
          return defaultConfig;
        } else {
          return {};
        }
      }
      case 'string': {
        if (config === 'tab') {
          return {
            indentation: 1,
          };
        }
        break;
      }
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
      case 'undefined': {
        return {};
      }
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
    this.seen = new Set();

    return {
      Template: {
        enter(node) {
          this.template = node;
          return node;
        },
        exit() {
          this.template = null;
        },
      },

      BlockStatement(node) {
        return this.process(node);
      },

      ElementNode: {
        enter(node) {
          this._elementStack.push(node);

          return this.process(node);
        },
        exit() {
          this._elementStack.pop();
        },
      },
    };
  }

  /**
   *
   * @param {Node} node - Current node or parent node if path is set
   * @param {String[]} path - path of the node being currently edited
   * @returns {Node}
   */
  process(node, path) {
    let fixedNode = this.validateBlockStart(node, path);

    // Nodes that start and end on the same line cannot have any indentation
    // issues (since the column of the start block was already checked in the
    // parent's validateBlockChildren())
    if (node.loc.start.line === node.loc.end.line || this.seen.has(node)) {
      this.seen.add(fixedNode);
      return fixedNode;
    }

    fixedNode = this.validateBlockElse(fixedNode, path);
    fixedNode = this.validateBlockEnd(fixedNode, path);
    fixedNode = this.validateBlockChildren(fixedNode, path);

    // If we are in fix mode we need to also fix all the children right now as fixing a child node
    // might introduce new line and so change the position ending of its parent
    if (this.mode === 'fix') {
      const currentPath = path || [];
      const sourceBeforeFix = this.sourceEdited || this.source.join('');

      const childrenWithPath = [];

      if (fixedNode.inverse) {
        const inverseChildPath = [...currentPath, 'inverse', 'body'];
        for (const [index, inverseNestedNode] of fixedNode.inverse.body.entries()) {
          childrenWithPath.push({
            path: [...inverseChildPath, index],
            child: inverseNestedNode,
          });
        }
      }

      const childPath =
        fixedNode.type === 'BlockStatement'
          ? [...currentPath, 'program', 'body']
          : [...currentPath, 'children'];
      const children =
        fixedNode.type === 'BlockStatement' ? fixedNode.program.body : fixedNode.children;
      for (const [index, nestedNode] of children.entries()) {
        childrenWithPath.push({
          path: [...childPath, index],
          child: nestedNode,
        });
      }

      // Process all the child with the path to access the child from the current node
      for (const { path: childPath, child } of childrenWithPath) {
        if (['BlockStatement', 'ElementNode'].includes(child.type)) {
          this.process(child, childPath);
        }
      }

      // Recreate the node only if the source has changed, otherwise this would mean useless computation and possible mistake
      if (sourceBeforeFix !== this.sourceEdited && this.sourceEdited) {
        fixedNode = this.fixLine(
          this.sourceEdited.split('\n'),
          0,
          fixedNode.loc.start.column,
          fixedNode.loc.start.column,
          path
        );
      }
    }

    this.seen.add(fixedNode);

    return fixedNode;
  }

  validateBlockStart(node) {
    if (!this.shouldValidateBlockStart(node)) {
      return node;
    }

    const indexOfNodeInTemplate = this.template.body.indexOf(node);
    const isDirectChildOfTemplate = indexOfNodeInTemplate !== -1;
    const hasLeadingContent =
      !isDirectChildOfTemplate || this.hasLeadingContent(node, this.template.body);
    const startColumn = node.loc.start.column;
    const expectedStartColumn =
      this.columnOffset === 0 || node.loc.start.line === 1
        ? 0
        : this.columnOffset + this.config.indentation;

    // If it's not a direct child of the template the block start is already fixed by the validateBlockChildren function
    if (isDirectChildOfTemplate && startColumn !== expectedStartColumn && !hasLeadingContent) {
      if (this.mode === 'fix') {
        const previousNode = this.template.body[indexOfNodeInTemplate - 1];
        if (previousNode.type === 'TextNode') {
          previousNode.chars =
            startColumn > expectedStartColumn
              ? removeWhitespaceEnd(previousNode.chars, startColumn - expectedStartColumn)
              : addWhitespaceEnd(previousNode.chars, expectedStartColumn - startColumn);
        }
      } else {
        let isElementNode = node && node.type === 'ElementNode';
        let displayName = isElementNode ? node.tag : node.path.original;
        let display = isElementNode ? `<${displayName}>` : `{{#${displayName}}}`;
        let startLocation = `L${node.loc.start.line}:C${node.loc.start.column}`;

        let warning =
          `Incorrect indentation for \`${display}\` beginning at ${startLocation}. ` +
          `Expected \`${display}\` to be at an indentation of ${expectedStartColumn}, but was found at ${startColumn}.`;

        this.log({
          message: warning,
          node,
          isFixable: true,
        });
      }
    }
    return node;
  }

  validateBlockEnd(node, path) {
    if (!this.shouldValidateBlockEnd(node)) {
      return node;
    }

    let isElementNode = node && node.type === 'ElementNode';
    let displayName = isElementNode ? node.tag : node.path.original;
    let display = isElementNode ? `</${displayName}>` : `{{/${displayName}}}`;
    let startColumn = node.loc.start.column;
    let endColumn = node.loc.end.column;

    let controlCharCount = this.endingControlCharCount(node);
    let correctedEndColumn = endColumn - displayName.length - controlCharCount;
    let expectedEndColumn =
      this.columnOffset === 0 || node.loc.end.line !== this.template.loc.end.line
        ? startColumn
        : this.columnOffset;

    if (correctedEndColumn !== expectedEndColumn) {
      if (this.mode === 'fix') {
        // If we are in a child (path set) we want to edit directly the source and not the source of the node
        const elementSource = path
          ? this.sourceEdited || this.source.join('')
          : `${' '.repeat(node.loc.start.column)}${sourceForLoc(this.sourceEdited || this.source, {
              end: node.loc.end,
              start: { line: node.loc.start.line, column: node.loc.start.column },
            })}`;
        const lines = elementSource.split('\n');
        const fixedNode = this.fixLine(
          lines,
          node.loc.end.line - (path ? 1 : node.loc.start.line),
          correctedEndColumn,
          expectedEndColumn,
          path
        );
        return fixedNode;
      } else {
        let startLocation = `L${node.loc.start.line}:C${node.loc.start.column}`;
        let endLocation = `L${node.loc.end.line}:C${node.loc.end.column}`;

        let warning =
          `Incorrect indentation for \`${displayName}\` beginning at ${startLocation}` +
          `. Expected \`${display}\` ending at ${endLocation} to be at an indentation of ${expectedEndColumn} but ` +
          `was found at ${correctedEndColumn}.`;

        this.log({
          message: warning,
          node,
          isFixable: true,
        });
      }
    }

    return node;
  }

  validateBlockChildren(node, path) {
    if (this.isWithinIgnoredElement()) {
      return node;
    }

    let children = AstNodeInfo.childrenFor(node).filter((x) => !x._isElseIfBlock);

    if (!AstNodeInfo.hasChildren(node)) {
      return node;
    }

    // HTML elements that start and end on the same line are fine
    if (node.loc.start.line === node.loc.end.line) {
      return node;
    }

    let startColumn = node.loc.start.column;
    let correctedStartColumn =
      this.columnOffset > 0 && node.loc.start.line === 1 ? this.columnOffset : startColumn;
    let expectedStartColumn = correctedStartColumn + this.config.indentation;
    let fixedNode = node;

    let i = 0;
    while (i < children.length) {
      let child = children[i];
      i += 1;

      if (!child.loc) {
        continue;
      }

      if (
        this.config.ignoreComments &&
        (child.type === 'CommentStatement' || child.type === 'MustacheCommentStatement')
      ) {
        break;
      }

      const hasLeadingContent = this.hasLeadingContent(child, children);

      if (hasLeadingContent) {
        // There's content before us on the same line, so we don't care about
        // our column.
        continue;
      }

      let childStartColumn = child.loc.start.column;
      let childStartLine = child.loc.start.line;

      // sanitize text node starting column info
      if (child.type === 'TextNode') {
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
          let leadingNewLines = child.chars.slice(0, newLineLength);
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
        if (this.mode === 'fix') {
          // If we are in a child (path set) we want to edit directly the source and not the source of the node
          const sourceToFix = path
            ? this.sourceEdited || this.source.join('')
            : sourceForLoc(this.sourceEdited || this.source, {
                end: fixedNode.loc.end,
                start: { line: fixedNode.loc.start.line, column: 0 },
              });
          const lines = sourceToFix.split('\n');

          fixedNode = this.fixLine(
            lines,
            childStartLine - (path ? 1 : fixedNode.loc.start.line),
            childStartColumn,
            expectedStartColumn,
            path
          );

          children = AstNodeInfo.childrenFor(fixedNode).filter((x) => !x._isElseIfBlock);
        } else {
          const display = this.getDisplayNameForNode(child);

          let startLocation = `L${childStartLine}:C${childStartColumn}`;
          let warning =
            `Incorrect indentation for \`${display}\` beginning at ${startLocation}` +
            `. Expected \`${display}\` to be at an indentation of ${expectedStartColumn} but ` +
            `was found at ${childStartColumn}.`;

          this.log({
            message: warning,
            node,
            line: childStartLine,
            column: childStartColumn,
            isFixable: true,
          });
        }
      }
    }

    return fixedNode;
  }

  validateBlockElse(node, path) {
    if (node.type !== 'BlockStatement' || !node.inverse) {
      return node;
    }

    if (this.detectNestedElseIfBlock(node)) {
      let elseBlockStatement = node.inverse.body[0];

      elseBlockStatement._isElseIfBlock = true;
    }

    let inverse = node.inverse;
    let startColumn = node.loc.start.column;
    let expectedStartColumn =
      this.columnOffset > 0 && node.loc.start.line === 1 ? this.columnOffset : startColumn;
    let elseStartColumn = node.program.loc.end.column;

    if (elseStartColumn !== expectedStartColumn) {
      if (this.mode === 'fix') {
        // If we are in a child (path set) we want to edit directly the source and not the source of the node
        const sourceToFix = path
          ? this.sourceEdited || this.source.join('')
          : sourceForLoc(this.sourceEdited || this.source, {
              end: node.loc.end,
              start: { line: node.loc.start.line, column: 0 },
            });
        const lines = sourceToFix.split('\n');
        const elseLine = node.program.loc.end.line;
        const fixedNode = this.fixLine(
          lines,
          elseLine - 1,
          elseStartColumn,
          expectedStartColumn,
          path
        );
        return fixedNode;
      } else {
        let displayName = node.path.original;
        let startLocation = `L${node.loc.start.line}:C${node.loc.start.column}`;
        let elseLocation = `L${inverse.loc.start.line}:C${elseStartColumn}`;

        let warning =
          `Incorrect indentation for inverse block of \`{{#${displayName}}}\` beginning at ${startLocation}` +
          `. Expected \`{{else}}\` starting at ${elseLocation} to be at an indentation of ${expectedStartColumn} but ` +
          `was found at ${elseStartColumn}.`;

        this.log({
          message: warning,
          node,
          line: inverse.loc.start.line,
          column: elseStartColumn,
          isFixable: true,
        });
      }
    }

    return node;
  }

  hasLeadingContent(node, parentChildren) {
    const currentIndex = parentChildren.indexOf(node);
    // We might not actually be the first thing on the line. We might be
    // preceded by another element or statement, or by some text. So walk
    // backwards looking for something else on this line.
    for (let j = currentIndex - 1; j >= 0; j--) {
      let sibling = parentChildren[j];
      if (sibling.loc && sibling.type !== 'TextNode') {
        // Found an element or statement. If it's on this line, then we
        // have leading content, so set the flag and break. If it's not
        // on this line, then we've scanned back to a previous line, so
        // we can also break.
        if (sibling.loc.end.line === node.loc.start.line) {
          return true;
        }
        break;
      } else {
        let lines = sibling.chars.split(/[\n\r]/);
        let lastLine = lines[lines.length - 1];
        if (lastLine.trim()) {
          // The last line in this text node has non-whitespace content, so
          // set the flag.
          return true;
        }
        if (lines.length > 1) {
          // There are multiple lines meaning we've now scanned back to a
          // previous line, so we can break.
          break;
        }
      }
    }

    return false;
  }

  getDisplayNameForNode(node) {
    switch (node.type) {
      case 'ElementNode': {
        return `<${node.tag}>`;
      }
      case 'BlockStatement': {
        return `{{#${node.path.original}}}`;
      }
      case 'MustacheStatement': {
        return `{{${node.path.original}}}`;
      }
      case 'TextNode': {
        return node.chars.replace(/^\s*/, '');
      }
      case 'CommentStatement': {
        return `<!--${node.value}-->`;
      }
      case 'MustacheCommentStatement': {
        return `{{!${node.value}}}`;
      }
      default: {
        return node.path.original;
      }
    }
  }

  fixLine(lines, lineNumber, actualColumn, expectedColumn, path) {
    const line = lines[lineNumber];

    // If line starts with only white spaces...
    if (line.startsWith(' '.repeat(actualColumn)) || actualColumn === expectedColumn) {
      // ... then it means we just need to fix the number of whitespace
      lines[lineNumber] = actualColumn
        ? line.replace(/^ +/, ' '.repeat(expectedColumn))
        : `${' '.repeat(expectedColumn)}${line}`;
    } else {
      // ... otherwise this mean the node is on the same line as another one so we need to add  new line between the 2 nodes
      lines[lineNumber] = `${line.slice(0, Math.max(0, actualColumn)).trimEnd()}\n${' '.repeat(
        expectedColumn
      )}${line.slice(Math.max(0, actualColumn))}`;
    }

    this.sourceEdited = lines.join('\n');

    let node = parse(this.sourceEdited).body.find((node) => node.type !== 'TextNode');
    node = get(node, path);

    // As we recreate a new node the _isElseIfBlock is not set anymore so we need to recompute it
    if (this.detectNestedElseIfBlock(node)) {
      let elseBlockStatement = node.inverse.body[0];

      elseBlockStatement._isElseIfBlock = true;
    }

    return node;
  }

  detectNestedElseIfBlock(node) {
    let inverse = node.inverse;
    let firstItem = inverse && inverse.body[0];

    // handle `{{else if foo}}`
    if (inverse && firstItem && firstItem.type === 'BlockStatement') {
      return (
        inverse.loc.start.line === firstItem.loc.start.line &&
        // as of glimmer-vm@0.24.0 the firstItem of a nested else if block
        // actually starts _before_ its parent's `start` O_o
        inverse.loc.start.column > firstItem.loc.start.column
      );
    }

    return false;
  }

  sourceDoesNotMatchNode(node, shouldIncludeEndingToken) {
    let source = sourceForLoc(this.sourceEdited || this.source, node.loc);
    let endingToken = `/${node.path.original}`;
    let indexOfEnding = source.lastIndexOf(endingToken);

    // Do not validate if source doesn't match node (if vs iframe)
    let charAfterEnding = source[indexOfEnding + endingToken.length];
    if (indexOfEnding !== -1 && !VALID_FOLLOWING_CHARS.has(charAfterEnding)) {
      return true;
    }

    return !shouldIncludeEndingToken || indexOfEnding !== -1;
  }

  shouldValidateBlockStart(node) {
    if (node._isElseIfBlock) {
      return false;
    }

    // do not validate indentation on VOID_TAG's
    if (VOID_TAGS[node.tag]) {
      return true;
    }

    if (this.isWithinIgnoredElement()) {
      return false;
    }

    // do not validate nodes without children (whitespace will count as TextNodes)
    if (node && node.type === 'ElementNode') {
      return true;
    }

    return this.sourceDoesNotMatchNode(node, false);
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
      return false;
    }

    // do not validate nodes without children (whitespace will count as TextNodes)
    if (node && node.type === 'ElementNode') {
      return AstNodeInfo.hasChildren(node);
    }

    return this.sourceDoesNotMatchNode(node, true);
  }

  endingControlCharCount(node) {
    if (node && node.type === 'ElementNode') {
      // </>
      return 3;
    }

    let source = sourceForLoc(this.sourceEdited || this.source, node.loc);
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
}

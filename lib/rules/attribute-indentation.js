import { parse, sourceForLoc }  from 'ember-template-recast';

import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

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

function getWhiteSpaceLength(statement) {
  let whiteSpace = statement.match(/^\s+/) || [];
  return (whiteSpace[0] || '').length;
}

function getEndLocationForOpen(node) {
  if (node.type === 'BlockStatement') {
    /*
      For a block statement, the start of the program block is the end of the open invocation.

      {{#contact-details firstName=firstName lastName=lastName as |contact|}}
        {{contact.fullName}}
      {{/contact-details}}
    */

    return node.program.loc.start;
  } else if (node.type === 'ElementNode' && node.children.length > 0) {
    return node.children[0].loc.start;
  } else {
    return node.loc.end;
  }
}

function canApplyRule(node, type, config) {
  let end = getEndLocationForOpen(node);
  let start = node.loc.start;

  if (start.line === end.line) {
    return end.column - start.column > config.maxLength;
  }

  return true;
}

function sortByLoc(a, b) {
  if (a.loc.start.line < b.loc.start.line) {
    return -1;
  }

  if (a.loc.start.line === b.loc.start.line && a.loc.start.column < b.loc.start.column) {
    return -1;
  }

  if (a.loc.start.line === b.loc.start.line && a.loc.start.column === b.loc.start.column) {
    return 0;
  }

  return 1;
}
export default class AttributeIndentation extends Rule {
  getLineIndentation(node) {
    let currentLine = this.source[node.loc.start.line - 1];
    let leadingWhitespace = getWhiteSpaceLength(currentLine);

    if (leadingWhitespace === 0) {
      return node.loc.start.column;
    }

    return leadingWhitespace;
  }

  getBlockParamStartLoc(node) {
    let actual, expected;
    // This code uses the program start location to determine the actual location
    // of the block param. All the examples are given with the "}}" at the end
    // of the block param (e.g.: as |employee|}}). This assumption is incorrect so we need
    // to verify if the "}}" are on a new line and adjust the program start location accordingly
    const actualProgramStartLine = /^\s*}}/.test(this.source[node.program.loc.start.line - 1])
      ? 1
      : 0;
    const programStartLoc = {
      line: node.program.loc.start.line - actualProgramStartLine,
      column: node.program.loc.start.column,
    };
    let nodeStart = node.loc.start;
    if (node.params.length === 0 && node.hash.pairs.length === 0) {
      expected = {
        line: nodeStart.line + 1,
        column: nodeStart.column,
      };
      if (nodeStart.line === programStartLoc.line) {
        let displayName = `{{#${node.path.original}`;
        /*
        {{#employee-details as |employee|}}
          {{employee.name}}
        {{/employee-details}}
        */
        actual = {
          line: nodeStart.line,
          column: displayName.length,
        };
      } else {
        /*
        {{#employee-details
          as |employee|}}
          {{employee.name}}
        {{/employee-details}}
        */
        let source = this.sourceForNode({
          loc: {
            start: {
              line: programStartLoc.line,
              /*
                Setting column as 0, to get the entire line for calculating the start column.
                For instance, the below will result in `                    as |employee|}}` => 19
                  `{{#employee-details
                                      as |employee|}}
                    {{employee.name}}
                  {{/employee-details}}
                  `
              */
              column: 0,
            },
            end: programStartLoc,
          },
        });
        //
        /*
          Determining the actual column by calculating the whitespace length
            `{{#employee-details
                                as |employee|}} => 19
              {{employee.name}}
            {{/employee-details}}`
        */
        actual = {
          line: programStartLoc.line,
          column: getWhiteSpaceLength(source),
        };
      }
    } else {
      let paramOrHashPairEndLoc;

      if (node.params.length) {
        /*
        The block form may contain only positional params as below
        {{#employee-details
          firstName
          lastName
          age
        as |employee|}}
          {{employee.fullName}}
        {{/employee-details}}
        */
        paramOrHashPairEndLoc = node.params[node.params.length - 1].loc.end;
      }

      if (node.hash.pairs.length) {
        /*
        The block form may contain only named params as below
        {{#employee-details
          firstName=firstName
          lastName=lastName
          age=age
        as |employee|}}
          {{employee.fullName}}
        {{/employee-details}}
        */
        paramOrHashPairEndLoc = node.hash.loc.end;
      }

      const indentation = this.config.asIndentation === 'attribute' ? 2 : 0;
      expected = {
        line: paramOrHashPairEndLoc.line + 1,
        column: node.loc.start.column + indentation,
      };
      if (paramOrHashPairEndLoc.line === programStartLoc.line) {
        /*
        {{#employee-details
          employeeId=employeeId as |employee|}}
          {{employee.name}}
        {{/employee-details}}
        */
        actual = paramOrHashPairEndLoc;
      } else if (paramOrHashPairEndLoc.line < programStartLoc.line) {
        /*
        {{#employee-details
          employeeId=employeeId
        as |employee|}}
          {{employee.name}}
        {{/employee-details}}
        */

        /*
        Since the below scenario is possible, we are getting the source of params/hash pair line.

        {{#employee-details
          id=id as |employee
          address|}}
          {{employee.name}}
        {{/employee-details}}
        */

        let loc = {
          start: paramOrHashPairEndLoc,
          end: {
            line: paramOrHashPairEndLoc.line,
          },
        };

        let hashPairLineEndSource = this.sourceForNode({ loc }).trim();

        if (hashPairLineEndSource) {
          /*
          {{#employee-details
            id=id as |employee
            address|}}
            {{employee.name}}
          {{/employee-details}}
          */
          actual = paramOrHashPairEndLoc;
        } else {
          /*
          {{#employee-details
            id=id
                  as |employee address|}}
            {{employee.name}}
          {{/employee-details}}
          */
          actual = {
            line: programStartLoc.line,
            column: getWhiteSpaceLength(this.source[programStartLoc.line - 1]),
          };
        }
      }
    }
    return {
      actual,
      expected,
    };
  }

  validateBlockParams(node) {
    /*
      Validates alignment of the block params.

      {{#employee-details
        employeeId=employeeId
      as |name age address|}}
        {{name}}, {{age}}, {{address}}
      {{/employee-details}}
    */

    let location = this.getBlockParamStartLoc(node);
    let actual = location.actual;
    let expected = location.expected;

    if (actual.line !== expected.line || actual.column !== expected.column) {
      let blockParamStatement = this.sourceForNode({
        loc: { start: actual, end: node.program.loc.start },
      }).trim();

      let message = `Incorrect indentation of block params '${blockParamStatement}' beginning at L${actual.line}:C${actual.column}. Expecting the block params to be at L${expected.line}:C${expected.column}.`;

      this.log({
        message,
        node,
        line: actual.line,
        column: actual.column,
        source: this.sourceForNode(node),
        isFixable: true,
      });
    }
    const expectedColumnNextLocation = node.type === 'ElementNode' && !node.selfClosing ? 1 : 2;
    return {
      line: expected.line + 1,
      column: expected.column + node.program.loc.start.column - expectedColumnNextLocation,
    };
  }

  iterateParams(params, type, expectedLineStart, expectedColumnStart, node) {
    let paramType = type;
    let namePath;

    switch (type) {
      case 'positional': {
        paramType = 'positional param';
        namePath = 'original';

        break;
      }
      case 'htmlAttribute': {
        paramType = 'htmlAttribute';
        namePath = 'name';

        break;
      }
      case 'element modifier': {
        paramType = 'element modifier';

        break;
      }
      default: {
        paramType = type;
        namePath = 'key';
      }
    }

    let nextColumn = expectedColumnStart;
    for (const param of params) {
      let actualStartLocation = param.loc.start;
      nextColumn = param.loc.end.column;
      if (
        expectedLineStart !== actualStartLocation.line ||
        expectedColumnStart !== actualStartLocation.column
      ) {
        let paramName = param[namePath] ? param[namePath] : param.path.original;
        let message = `Incorrect indentation of ${paramType} '${paramName}' beginning at L${actualStartLocation.line}:C${actualStartLocation.column}. Expected '${paramName}' to be at L${expectedLineStart}:C${expectedColumnStart}.`;
        this.log({
          message,
          node,
          line: actualStartLocation.line,
          column: actualStartLocation.column,
          source: this.sourceForNode(node),
          isFixable: true,
        });
      }

      const type = param.value ? param.value.type : param.type;
      if (type === 'SubExpression') {
        // TODO check subexpressions
        if (param.loc.start.line !== param.loc.end.line) {
          expectedLineStart = param.loc.end.line;
        }
      } else if (type === 'MustacheStatement') {
        expectedLineStart = param.value.loc.end.line;
        nextColumn = param.value.loc.end.column;
      }

      expectedLineStart++;
    }

    return {
      line: expectedLineStart,
      column: nextColumn,
    };
  }

  validateParams(node) {
    /*
        Validates both the positional and named params for both block and non-block form.

        {{contact-details
          age
          firstName=firstName
          fullName=fullName
        }}
    */
    let leadingWhitespace = this.getLineIndentation(node);
    let expectedColumnStart = leadingWhitespace + this.config.indentation; // params should be after proper positions from component start node
    let expectedLineStart = node.loc.start.line + 1;

    let nextLocation = {
      line: expectedLineStart,
      column: node.loc.start.column,
    };
    if (node.type === 'ElementNode') {
      if (node.attributes.length > 0) {
        nextLocation = this.iterateParams(
          node.attributes,
          'htmlAttribute',
          expectedLineStart,
          expectedColumnStart,
          node
        );
      }

      if (node.modifiers.length > 0) {
        nextLocation = this.iterateParams(
          node.modifiers,
          'element modifier',
          nextLocation.line,
          expectedColumnStart,
          node
        );
      }
    } else {
      if (node.path.loc.source === '(synthetic)') {
        expectedLineStart--;
        if (node.type === 'BlockStatement') {
          node.params[0].loc.start.column--;
        }
      }
      if (node.params.length > 0) {
        nextLocation = this.iterateParams(
          node.params,
          'positional',
          expectedLineStart,
          expectedColumnStart,
          node
        );
      }
      if (node.hash.pairs.length > 0) {
        nextLocation = this.iterateParams(
          node.hash.pairs,
          'attribute',
          nextLocation.line,
          expectedColumnStart,
          node
        );
      }
    }

    return nextLocation;
  }

  validateCloseBrace(node, nextLocation) {
    /*
      Validates the close brace `}}` (`}}}` for non-escaped) for Handlebars and `>` for HTML/SVG elements of the non-block form.
    */
    let openIndentation = this.getLineIndentation(node);

    let end = getEndLocationForOpen(node);
    const actualColumnStartLocation =
      node.type === 'ElementNode' && !node.selfClosing
        ? 1
        : node.type === 'MustacheStatement' && !node.escaped
        ? 3
        : 2;

    const actualStartLocation = {
      line: end.line,
      column: end.column - actualColumnStartLocation,
    };

    const endPosition =
      node.type === 'ElementNode' ? this.config.elementOpenEnd : this.config.mustacheOpenEnd;
    const expectedStartLocation = {
      line: endPosition === 'last-attribute' ? nextLocation.line - 1 : nextLocation.line,
      column: endPosition === 'last-attribute' ? nextLocation.column : openIndentation,
    };

    let componentName = node.type === 'ElementNode' ? node.tag : node.path.original;
    if (
      actualStartLocation.line !== expectedStartLocation.line ||
      actualStartLocation.column !== expectedStartLocation.column
    ) {
      let message = `Incorrect indentation of close curly braces '}}' for the component '{{${componentName}}}' beginning at L${actualStartLocation.line}:C${actualStartLocation.column}. Expected '{{${componentName}}}' to be at L${expectedStartLocation.line}:C${expectedStartLocation.column}.`;
      if (node.type === 'ElementNode') {
        message = `Incorrect indentation of close bracket '>' for the element '<${componentName}>' beginning at L${actualStartLocation.line}:C${actualStartLocation.column}. Expected '<${componentName}>' to be at L${expectedStartLocation.line}:C${expectedStartLocation.column}.`;
      }

      if (this.mode === 'fix') {
        return expectedStartLocation;
      } else {
        this.log({
          message,
          node,
          line: actualStartLocation.line,
          column: actualStartLocation.column,
          source: this.sourceForNode(node),
          isFixable: true,
        });
      }
    }
  }

  validateClosingTag(node, expectedStartLine) {
    /*
      Validates the closing tag (`</tag>`) of the block form.
    */
    const actualColumnStartLocation = 3 + node.tag.length;
    const actualStartLocation = {
      line: node.loc.end.line,
      column: node.loc.end.column - actualColumnStartLocation,
    };

    const expectedStartLocation = {
      line: expectedStartLine,
      column: node.loc.start.column,
    };

    let tagName = node.type === 'ElementNode' ? node.tag : node.path.original;
    if (
      actualStartLocation.line !== expectedStartLocation.line ||
      actualStartLocation.column !== expectedStartLocation.column
    ) {
      let message = `Incorrect indentation of close tag '</${tagName}>' for element '<${tagName}>' beginning at L${actualStartLocation.line}:C${actualStartLocation.column}. Expected '</${tagName}>' to be at L${expectedStartLocation.line}:C${expectedStartLocation.column}.`;

      this.log({
        message,
        node,
        line: actualStartLocation.line,
        column: actualStartLocation.column,
        source: this.sourceForNode(node),
        isFixable: true,
      });
    }
  }

  validateNonBlockForm(node) {
    // no need to validate if no positional and named params are present.
    if (node.params.length || node.hash.pairs.length) {
      const nextLocation = this.validateParams(node);
      this.validateCloseBrace(node, nextLocation);
      return nextLocation;
    }
  }

  validateBlockForm(node) {
    let nextLocation;
    if (node.params.length || node.hash.pairs.length) {
      nextLocation = this.validateParams(node);
    }
    if (node.program.blockParams && node.program.blockParams.length) {
      nextLocation = this.validateBlockParams(node);
    }
    this.validateCloseBrace(node, nextLocation);
  }

  parseConfig(config) {
    let configType = typeof config;
    const OPEN_END_CONFIG_VALUES = new Set(['new-line', 'last-attribute']);
    const AS_INDENTATION_VALUES = new Set(['attribute', 'closing-brace']);

    switch (configType) {
      case 'boolean':
        if (config) {
          return {
            maxLength: 80,
            indentation: 2,
            processElements: true,
            mustacheOpenEnd: 'new-line',
            elementOpenEnd: 'new-line',
          };
        }
        return false;
      case 'object': {
        let result = {
          maxLength: 80,
          indentation: 2,
          mustacheOpenEnd: 'new-line',
          elementOpenEnd: 'new-line',
        };
        if ('open-invocation-max-len' in config) {
          result.maxLength = config['open-invocation-max-len'];
        }
        if ('indentation' in config) {
          result.indentation = config.indentation;
        }
        if ('process-elements' in config) {
          result.processElements = config['process-elements'];
        }
        if ('mustache-open-end' in config) {
          if (!OPEN_END_CONFIG_VALUES.has(config['mustache-open-end'])) {
            break;
          }
          result.mustacheOpenEnd = config['mustache-open-end'];
        }
        if ('element-open-end' in config) {
          if (!OPEN_END_CONFIG_VALUES.has(config['element-open-end'])) {
            break;
          }
          // if element-open-end is set, assume process-elements=true
          result.processElements = true;
          result.elementOpenEnd = config['element-open-end'];
        }
        if ('as-indentation' in config) {
          if (!AS_INDENTATION_VALUES.has(config['as-indentation'])) {
            break;
          }
          result.asIndentation = config['as-indentation'];
        }
        return result;
      }
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` - Enables the rule to be enforced when the opening invocation has more than 80 characters or when it spans multiple lines.',
        '  * { open-invocation-max-len: n characters, indentation: m  } - n : The max length of the opening invocation can be configured',
        '  *                                                            - m : The desired indentation of attribute',
        '  * { process-elements: `boolean` } - `true` : Also parse HTML/SVG attributes',
        '  * { element-open-end: `new-line`|`last-attribute` } - Enforce the position of the closing brace `>` to be on a new line or next to the last attribute (defaults to `new-line`)',
        '  * { mustache-open-end: `new-line`|`last-attribute` } - Enforce the position of the closing braces `}}` to be on a new line or next to the last attribute (defaults to `new-line`)',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  fixElementNode(
    node,
    returnString = false,
    { startColumn = null, shouldIndentOpeningSource = false } = {}
  ) {
    // when returning a new node from a visitor hook the new node
    // is _also_ traversed, we want to avoid attempting to calculate
    // the source **again**
    if (this.seen.has(node)) {
      return node;
    }

    let startLocation = startColumn !== null ? startColumn : node.loc.start.column;
    let indentation = ' '.repeat(startLocation + 2);

    let parts = [...node.attributes, ...node.comments].sort(sortByLoc);
    parts.push(...node.modifiers.sort(sortByLoc));
    let partsSources = parts.map((part) => {
      return this.fixNode(part, {
        startColumn: startLocation + 2,
        shouldIndentOpeningSource: false,
      });
    });
    let openingSource = `<${node.tag}`;
    let closingOpenSource = node.selfClosing ? '/>' : '>';

    let blockParamsSource = '';
    if (node.blockParams.length > 0) {
      blockParamsSource = `as |${node.blockParams.join(' ')}|`;
    }
    const singleLineOpeningElement = `${[openingSource, ...partsSources, blockParamsSource]
      .join(' ')
      .trimEnd()}${closingOpenSource}`;

    let childrenSource =
      node.children.length > 0
        ? node.children
            .map((child) =>
              this.fixNode(child, {
                startColumn: startLocation + 2,
                shouldIndentOpeningSource: true,
              }).replace(/ +$/, '')
            )
            .join('')
        : '';
    const closingIndentation = ' '.repeat(startLocation);
    const newLineBeforeClosingOpenSource =
      this.config.elementOpenEnd === 'last-attribute' ? '' : `\n${closingIndentation}`;
    const newLineBeforeBlockParams =
      this.config.asIndentation === 'attribute' ? `\n${indentation}` : `\n${closingIndentation}`;
    const indentationBeforeOpeningSource = shouldIndentOpeningSource ? closingIndentation : '';

    let multiLine = singleLineOpeningElement.length > this.config.maxLength;
    let openingElement = !multiLine
      ? `${indentationBeforeOpeningSource}${singleLineOpeningElement}`
      : [
          indentationBeforeOpeningSource,
          `${openingSource}\n`,
          partsSources.map((partSource) => `${indentation}${partSource}`).join('\n'),
          blockParamsSource && `${newLineBeforeBlockParams}${blockParamsSource}`,
          `${newLineBeforeClosingOpenSource}${closingOpenSource}`,
        ].join('');

    // decide if we should emit a single line or multiple
    let closingSource = node.selfClosing || VOID_TAGS[node.tag] ? '' : `</${node.tag}>`;

    let replacementElementSource = [
      openingElement,
      childrenSource.replace(/ +$/, ''),
      closingSource.replace(/ +$/, ''),
    ].join('');

    if (
      replacementElementSource.length > this.config.maxLength ||
      replacementElementSource.includes('\n')
    ) {
      openingElement =
        childrenSource.startsWith('\n') || !closingSource ? openingElement : `${openingElement}\n`;
      closingSource =
        closingSource &&
        (childrenSource.endsWith('\n')
          ? `${closingIndentation}${closingSource}`
          : `\n${closingIndentation}${closingSource}`);

      replacementElementSource = [
        openingElement,
        childrenSource.replace(/ +$/, ''),
        closingSource.replace(/ +$/, ''),
      ].join('');
    }

    this.seen.add(node);

    return this.returnElement(replacementElementSource, 'ElementNode', returnString);
  }

  fixMustacheStatement(
    node,
    returnString = false,
    { startColumn = null, shouldIndentOpeningSource = false } = {}
  ) {
    // when returning a new node from a visitor hook the new node
    // is _also_ traversed, we want to avoid attempting to calculate
    // the source **again**
    if (this.seen.has(node)) {
      return node;
    }

    let startLocation = startColumn !== null ? startColumn : node.loc.start.column;
    let indentation = ' '.repeat(startLocation + 2);

    let parts = [...node.params, ...node.hash.pairs];

    let partsSources = parts.sort(sortByLoc).map((part) => {
      return this.fixNode(part, { startColumn: startLocation + 2 });
    });
    const openingBrace = `{{${node.path.original}`;
    const closingBrace = '}}';
    const singleLineElement = `${[openingBrace, ...partsSources].join(' ')}${closingBrace}`;
    const closingIndentation = ' '.repeat(startLocation);
    const indentationBeforeOpeningSource = shouldIndentOpeningSource ? closingIndentation : '';

    if (singleLineElement.length <= this.config.maxLength || !parts.length) {
      let fakeElement = parse(`${indentationBeforeOpeningSource}${singleLineElement}`).body[0];
      this.seen.add(fakeElement);
      this.seen.add(node);

      return returnString ? `${indentationBeforeOpeningSource}${singleLineElement}` : fakeElement;
    }

    // decide if we should emit a single line or multiple

    let partsSource = partsSources
      .map((partSource) => (partSource === '\n' ? partSource : `${indentation}${partSource}`))
      .join('\n');

    const newLineBeforeClosingOpenSource =
      this.config.mustacheOpenEnd === 'last-attribute' ? '' : '\n';

    let closingOpenSource =
      startLocation && newLineBeforeClosingOpenSource
        ? `\n${closingIndentation}}}`
        : `${newLineBeforeClosingOpenSource}}}`;
    // let closingSource = node.selfClosing ? '' : `</${node.tag}>`;

    // let newLine = '';
    // for (let i = 0; i < node.loc.data.hbsPositions.start.hbsPos.line; i += 1) {
    //   newLine += '\n';
    // }

    let replacementElementSource = [
      indentationBeforeOpeningSource,
      `${openingBrace}\n`,
      partsSource,
      closingOpenSource,
    ].join('');

    this.seen.add(node);

    return this.returnElement(replacementElementSource, 'MustacheStatement', returnString);
  }

  fixBlockStatement(
    node,
    returnString = false,
    { startColumn = null, shouldIndentOpeningSource = false } = {}
  ) {
    // when returning a new node from a visitor hook the new node
    // is _also_ traversed, we want to avoid attempting to calculate
    // the source **again**
    if (this.seen.has(node)) {
      return node;
    }

    let startLocation = startColumn !== null ? startColumn : node.loc.start.column;
    let indentation = ' '.repeat(startLocation + 2);

    let parts = [...node.params, ...node.hash.pairs];
    let partsSources = parts.map((part) => {
      return this.fixNode(part, {
        startColumn: startLocation + 2,
        shouldIndentOpeningSource: false,
      });
    });
    let openingSource = `{{#${node.path.original}`;
    let closingOpenSource = '}}';

    let blockParamsSource = '';
    if (node.program.blockParams.length) {
      blockParamsSource = `as |${node.program.blockParams.join(' ')}|`;
    }
    const singleLineOpeningElement = `${[openingSource, ...partsSources, blockParamsSource]
      .join(' ')
      .trimEnd()}${closingOpenSource}`;

    let childrenSource =
      node.program.body.length > 0
        ? node.program.body
            .map((child) =>
              this.fixNode(child, {
                startColumn: startLocation + 2,
                shouldIndentOpeningSource: true,
              }).replace(/ +$/, '')
            )
            .join('')
        : '';
    const closingIndentation = ' '.repeat(startLocation);
    const newLineBeforeClosingOpenSource =
      this.config.mustacheOpenEnd === 'last-attribute' ? '' : `\n${closingIndentation}`;
    const newLineBeforeBlockParams =
      this.config.asIndentation === 'attribute' ? `\n${indentation}` : `\n${closingIndentation}`;
    const indentationBeforeOpeningSource = shouldIndentOpeningSource ? closingIndentation : '';

    const multiline = singleLineOpeningElement.length <= this.config.maxLength;

    let openingElement = multiline
      ? `${indentationBeforeOpeningSource}${singleLineOpeningElement}`
      : [
          indentationBeforeOpeningSource,
          `${openingSource}\n`,
          partsSources
            .map((partSource) => `${indentation}${partSource}`.replace(/ +$/, ''))
            .join('\n'),
          blockParamsSource && `${newLineBeforeBlockParams}${blockParamsSource}`,
          `${newLineBeforeClosingOpenSource}${closingOpenSource}`,
        ].join('');
    openingElement = childrenSource.startsWith('\n') ? openingElement : `${openingElement}\n`;

    // decide if we should emit a single line or multiple
    let closingSource = `${closingIndentation}{{/${node.path.original}}}`;
    closingSource = childrenSource.endsWith('\n') ? closingSource : `\n${closingSource}`;

    let replacementElementSource = [openingElement, childrenSource, closingSource].join('');

    this.seen.add(node);

    return this.returnElement(replacementElementSource, 'BlockStatement', returnString);
  }

  returnElement(replacementElementSource, elementType, returnString = false) {
    if (returnString) {
      return replacementElementSource;
    }

    let fakeElement = parse(replacementElementSource).body.find(
      (element) => element.type === elementType
    );

    this.markAsSeen(fakeElement);

    return fakeElement;
  }

  markAsSeen(node) {
    switch (node.type) {
      case 'BlockStatement':
        this.markBlockStatementAsSeen(node);
        break;
      case 'MustacheStatement':
        this.markMustacheStatementAsSeen(node);
        break;
      case 'ElementNode':
        this.markElementNodeAsSeen(node);
        break;
      default:
        if (node.value) {
          this.markAsSeen(node.value);
        }
        this.seen.add(node);
        break;
    }
  }

  markBlockStatementAsSeen(node) {
    for (const nestedNode of [...node.params, ...node.hash.pairs, ...node.program.body]) {
      this.markAsSeen(nestedNode);
    }
    this.seen.add(node);
  }

  markMustacheStatementAsSeen(node) {
    for (const nestedNode of [...node.params, ...node.hash.pairs]) {
      this.markAsSeen(nestedNode);
    }
    this.seen.add(node);
  }

  markElementNodeAsSeen(node) {
    for (const nestedNode of [
      ...node.attributes,
      ...node.comments,
      ...node.modifiers,
      ...node.children,
    ]) {
      this.markAsSeen(nestedNode);
    }
    this.seen.add(node);
  }

  fixNode(node, options) {
    const fixAttributeNode = () => {
      const newValue = this.fixNode(node.value, options);
      const quote = !node.quoteType || newValue.startsWith(node.quoteType) ? '' : node.quoteType;
      const newValueWithEqual = newValue || quote ? `=${quote}${newValue}${quote}` : '';

      return `${node.key || node.name}${newValueWithEqual}`;
    };

    switch (node.type) {
      case 'BlockStatement':
        return this.fixBlockStatement(node, true, options);
      case 'MustacheStatement':
        return this.fixMustacheStatement(node, true, options);
      case 'ElementNode':
        return this.fixElementNode(node, true, options);
      case 'HashPair':
      case 'AttrNode':
        return fixAttributeNode();
      case 'TextNode':
        return node.chars;
      case 'BooleanLiteral':
        return node.value;
      default:
        return sourceForLoc(
          node.loc.source || (node.loc.data && node.loc.data.source.source) || this.source,
          node.loc
        );
    }
  }

  visitor() {
    this.seen = new Set();

    return {
      BlockStatement(node) {
        if (this.mode === 'fix') {
          return this.fixBlockStatement(node);
        }
        if (canApplyRule(node, node.type, this.config)) {
          this.validateBlockForm(node);
        }
        return node;
      },
      MustacheStatement(node) {
        if (this.mode === 'fix') {
          return this.fixMustacheStatement(node);
        }
        if (canApplyRule(node, node.type, this.config)) {
          this.validateNonBlockForm(node);
        }
        return node;
      },
      ElementNode(node) {
        if (this.config.processElements) {
          if (this.mode === 'fix') {
            return this.fixElementNode(node);
          }
          if (canApplyRule(node, node.type, this.config)) {
            if (node.modifiers.length > 0 || node.attributes.length > 0) {
              let expectedCloseBraceLocation = this.validateParams(node);
              this.validateCloseBrace(node, expectedCloseBraceLocation);
            }

            if (node.children.length) {
              const lastChild = node.children[node.children.length - 1];
              const expectedStartLine =
                lastChild.type === 'BlockStatement'
                  ? lastChild.loc.end.line + 1
                  : lastChild.loc.end.line;
              this.validateClosingTag(node, expectedStartLine);
            }
          }
        }
        return node;
      },
    };
  }
}

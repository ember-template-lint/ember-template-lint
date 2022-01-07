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

export default class AttributeIndentation extends Rule {
  fixLine(lines, actual, expected, path) {
    const currentLineIndex = actual.line - 1;
    const line = lines[currentLineIndex];

    console.log('lines', lines);
    if (actual.line > expected.line) {
      console.log('actual.line > expected.line')
      lines.splice(currentLineIndex, 1);

      // Depending if it's a parameter or a closing bracket we might not want a space between the previous line and the current one
      const prefixOfLine = lines[currentLineIndex - 1].length < expected.column ? ' ' : '';
      lines[currentLineIndex - 1] += `${prefixOfLine}${line.trimStart()}`;
    } else if (actual.line < expected.line) {
      console.log('actual.line < expected.line')
      const lineBefore = line.substring(0, actual.column).trimEnd();
      const lineAfter = line.substring(actual.column);
      lines[currentLineIndex] = `${lineBefore}\n${' '.repeat(expected.column)}${lineAfter}`;
    } else if (actual.column !== expected.column) {
      console.log('actual.column !== expected.column')
      if (line.startsWith(' '.repeat(actual.column))) {
        lines[currentLineIndex] = actual.column
          ? line.replace(/^ +/, ' '.repeat(expected.column))
          : `${' '.repeat(expected.column)}${line}`;
      } else {
        const lineBefore = line.substring(0, actual.column).trimEnd();
        const lineAfter = line.substring(lineBefore.length).trimStart();
        const spaceBetween = expected.column - lineBefore.length > 0 ? ' '.repeat(expected.column - lineBefore.length) : '';
        lines[currentLineIndex] = `${lineBefore}${spaceBetween}${lineAfter}`
      }
    }

    console.log('lines fixed', lines);
    // throw new Error();

    this.sourceEdited = lines.join('\n');

    let node = parse(this.sourceEdited).body.find((node) => node.type !== 'TextNode');
    node = get(node, path);

    this.seen.add(node);

    return node;
  }

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

    let fixedNode = node;
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
      nextLocation: {
        line: expected.line + 1,
        column: expected.column + node.program.loc.start.column - expectedColumnNextLocation,
      },
      fixedNode,
    };
  }

  iterateParams(params, type, expectedLineStart, expectedColumnStart, node, path) {
    let paramType = type;
    let namePath;
    let fixedNode = node;
    const currentPath = [...(path || [])];

    switch (type) {
      case 'positional': {
        paramType = 'positional param';
        namePath = 'original';
        currentPath.push('params');
        break;
      }
      case 'htmlAttribute': {
        paramType = 'htmlAttribute';
        namePath = 'name';
        currentPath.push('attributes');
        break;
      }
      case 'element modifier': {
        paramType = 'element modifier';
        currentPath.push('modifiers');
        break;
      }
      default: {
        paramType = type;
        namePath = 'key';
        currentPath.push('hash', 'pairs');
      }
    }

    let nextColumn = expectedColumnStart;
    let paramsToFix = params;
    for (let index = 0; index < paramsToFix.length; index += 1) {
      const param = paramsToFix[index];
      const paramPath = [...currentPath, paramsToFix.indexOf(param)];
      let fixedParam = param;
      let actualStartLocation = param.loc.start;
      nextColumn = param.loc.end.column;

      console.log([...currentPath, params.indexOf(param)], 'expected', `L${expectedLineStart}C${expectedColumnStart}`, 'actual', `L${actualStartLocation.line}C${actualStartLocation.column}`)
      if (
        expectedLineStart !== actualStartLocation.line ||
        expectedColumnStart !== actualStartLocation.column
      ) {
        if (this.mode === 'fix') {
          const sourceToFix = this.sourceEdited || this.source.join('');
          const lines = sourceToFix.split('\n');
          fixedParam = this.fixLine(lines, actualStartLocation, { line: expectedLineStart, column: expectedColumnStart }, paramPath);
          fixedNode = this.sourceEdited ? this.fixLine(this.sourceEdited.split('\n'), fixedNode.loc.start, fixedNode.loc.start, path) : fixedNode;
          paramsToFix = get(fixedNode, currentPath);
        } else {
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
      }

      if (!fixedParam) {
        console.log(fixedNode, paramPath);
      }
      const type = fixedParam.value ? fixedParam.value.type : fixedParam.type;
      if (this.mode === 'fix' && type === 'MustacheStatement') {
        fixedParam = this.validateMustacheStatement(fixedParam.value || fixedParam, paramPath);
        fixedNode = this.sourceEdited ? this.fixLine(this.sourceEdited.split('\n'), fixedNode.loc.start, fixedNode.loc.start, path) : fixedNode;
        paramsToFix = get(fixedNode, currentPath);

        expectedLineStart = fixedParam.loc.end.line;
      } else if (type === 'SubExpression') {
        // TODO check subexpressions
        if (fixedParam.loc.start.line !== fixedParam.loc.end.line) {
          expectedLineStart = fixedParam.loc.end.line;
        }
      } else if (type === 'MustacheStatement') {
        expectedLineStart = fixedParam.value.loc.end.line;
        nextColumn = fixedParam.value.loc.end.column;
      }


      expectedLineStart++;
    }

    return {
      nextLocation: {
        line: expectedLineStart,
        column: nextColumn,
      },
      fixedNode,
    };
  }

  validateParams(node, path) {
    /*
        Validates both the positional and named params for both block and non-block form.

        {{contact-details
          age
          firstName=firstName
          fullName=fullName
        }}
    */
    let fixedNode = node;
    let leadingWhitespace = this.getLineIndentation(fixedNode);
    let expectedColumnStart = leadingWhitespace + this.config.indentation; // params should be after proper positions from component start fixedNode
    let expectedLineStart = fixedNode.loc.start.line + 1;

    let nextLocation = {
      line: expectedLineStart,
      column: fixedNode.loc.start.column,
    };
    if (fixedNode.type === 'ElementNode') {
      if (fixedNode.attributes.length > 0) {
        ({ nextLocation, fixedNode } = this.iterateParams(
          fixedNode.attributes,
          'htmlAttribute',
          expectedLineStart,
          expectedColumnStart,
          fixedNode,
          path
        ));
      }

      if (fixedNode.modifiers.length > 0) {
        ({ nextLocation, fixedNode } = this.iterateParams(
          fixedNode.modifiers,
          'element modifier',
          nextLocation.line,
          expectedColumnStart,
          fixedNode,
          path
        ));
      }
    } else {
      if (fixedNode.path.loc.source === '(synthetic)') {
        expectedLineStart--;
        if (fixedNode.type === 'BlockStatement') {
          fixedNode.params[0].loc.start.column--;
        }
      }
      if (fixedNode.params.length > 0) {
        ({ nextLocation, fixedNode } = this.iterateParams(
          fixedNode.params,
          'positional',
          expectedLineStart,
          expectedColumnStart,
          fixedNode,
          path
        ));
      }
      if (fixedNode.hash.pairs.length > 0) {
        ({ nextLocation, fixedNode } = this.iterateParams(
          fixedNode.hash.pairs,
          'attribute',
          nextLocation.line,
          expectedColumnStart,
          fixedNode,
          path
        ));
      }
    }

    return { nextLocation, fixedNode };
  }

  validateCloseBrace(node, nextLocation, path) {
    /*
      Validates the close brace `}}` (`}}}` for non-escaped) for Handlebars and `>` for HTML/SVG elements of the non-block form.
    */
    let openIndentation = this.getLineIndentation(node);

    let fixedNode = node;
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

    console.log('actualStartLocation', actualStartLocation)
    const endPosition =
      node.type === 'ElementNode' ? this.config.elementOpenEnd : this.config.mustacheOpenEnd;
    const expectedStartLocation = {
      line: endPosition === 'last-attribute' ? nextLocation.line - 1 : nextLocation.line,
      column: endPosition === 'last-attribute' ? nextLocation.column : openIndentation,
    };
    console.log('expectedStartLocation', expectedStartLocation)

    let componentName = node.type === 'ElementNode' ? node.tag : node.path.original;
    if (
      actualStartLocation.line !== expectedStartLocation.line ||
      actualStartLocation.column !== expectedStartLocation.column
    ) {
      if (this.mode === 'fix') {
        const sourceToFix = this.sourceEdited || this.source.join('');
        const lines = sourceToFix.split('\n');
        return this.fixLine(lines, actualStartLocation, expectedStartLocation, path);
      } else {
        let message = `Incorrect indentation of close curly braces '}}' for the component '{{${componentName}}}' beginning at L${actualStartLocation.line}:C${actualStartLocation.column}. Expected '{{${componentName}}}' to be at L${expectedStartLocation.line}:C${expectedStartLocation.column}.`;
        if (node.type === 'ElementNode') {
          message = `Incorrect indentation of close bracket '>' for the element '<${componentName}>' beginning at L${actualStartLocation.line}:C${actualStartLocation.column}. Expected '<${componentName}>' to be at L${expectedStartLocation.line}:C${expectedStartLocation.column}.`;
        }

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

    return fixedNode;
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

    return node;
  }

  validateNonBlockForm(node, path) {
    // no need to validate if no positional and named params are present.
    if (node.params.length || node.hash.pairs.length) {
      const { nextLocation, fixedNode } = this.validateParams(node, path);
      return this.validateCloseBrace(fixedNode, nextLocation, path);
    }
    return node;
  }

  validateBlockForm(node) {
    let fixedNode = node;
    let nextLocation;
    if (fixedNode.params.length || fixedNode.hash.pairs.length) {
      ({ nextLocation, fixedNode } = this.validateParams(fixedNode));
    }
    if (fixedNode.program.blockParams && fixedNode.program.blockParams.length) {
      ({ nextLocation, fixedNode } = this.validateBlockParams(fixedNode));
    }
    return this.validateCloseBrace(fixedNode, nextLocation);
  }

  validateMustacheStatement(node, path) {
    if (canApplyRule(node, node.type, this.config) && !this.seen.has(node)) {
      return this.validateNonBlockForm(node, path);
    }
    return node;
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

  visitor() {
    this.seen = new Set();

    return {
      BlockStatement(node) {
        if (canApplyRule(node, node.type, this.config) && !this.seen.has(node)) {
          return this.validateBlockForm(node);
        }
        return node;
      },
      MustacheStatement(node) {
        return this.validateMustacheStatement(node);
      },
      ElementNode(node) {
        if (this.config.processElements && !this.seen.has(node)) {
          if (canApplyRule(node, node.type, this.config)) {
            let fixedNode = node;
            if (node.modifiers.length > 0 || node.attributes.length > 0) {
              let expectedCloseBraceLocation;
              ({ fixedNode, nextLocation: expectedCloseBraceLocation } = this.validateParams(fixedNode));
              fixedNode = this.validateCloseBrace(fixedNode, expectedCloseBraceLocation);
            }

            if (fixedNode.children.length) {
              const lastChild = fixedNode.children[fixedNode.children.length - 1];
              const expectedStartLine =
                lastChild.type === 'BlockStatement'
                  ? lastChild.loc.end.line + 1
                  : lastChild.loc.end.line;
              fixedNode = this.validateClosingTag(fixedNode, expectedStartLine);
            }
            return fixedNode;
          }
        }
        return node;
      },
    };
  }
}

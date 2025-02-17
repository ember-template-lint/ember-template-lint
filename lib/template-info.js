/**
 * This whole file should be deleted in the next major
 * We don't want to be linting js/ts (with hbs)
 *
 * This file is soooorta a subset of content-tag-utils
 */
import * as babelParser from '@babel/parser';
import * as babelTraverse from '@babel/traverse';

/**
 *
 * @typedef {object} TemplateInfo
 * @property {number} line
 * @property {number} column
 * @property {string} template
 * @property {boolean} isEmbedded
 * @property {boolean} isStrictMode
 */

/**
 * Lines are always 1-indexed, and columns are 0-indexed
 */
const LOCATION_START = Object.freeze({ line: 1, column: 0, start: 0, end: 0, columnOffset: 0 });

/**
 * Returns the broader-file coordinates, given a result of coordinates
 * within the template
 *
 * @param {TemplateInfo} templateInfo
 * @param {*} result
 */
export function reverseInnerCoordinatesOf(templateInfo, result) {
  return {
    line: templateInfo.line + result.line - 1,
    column: templateInfo.columnOffset + result.column + 1,
    endLine: templateInfo.line + result.endLine - 1,
    endColumn: templateInfo.columnOffset + result.endColumn + 1,
  }
}

/**
 * for hbs and html files
 *
 * @param {string} source
 * @returns {TemplateInfo}
 */
export function templateInfoForTemplateFile(source) {
  return {
    ...makeTemplateInfo(
      {
        ...LOCATION_START,
        end: source.length - 1,
      },
      source
    ),
    isEmbedded: undefined,
    isStrictMode: false,
  };
}

/**
 * Parse cache exists since running babel.parse
 * over files is expensive, and we don't want it to happen
 * more than once.
 *
 * @type {Map<string, any>}
 */
const BABLE_CACHE = new Map();

function parseWithBabel(source) {
  let existing = BABLE_CACHE.get(source);

  if (existing) {
    return existing;
  }

  /**
   * If you find yourself debugging this because you're using some custom syntax with babel,
   * we can't support that.
   *
   * In particular: JSX/TSX.
   * You need a trailing x on your file extension anyway.
   *
   * What is supported:
   * - In implementation:
   *   - decorators
   *
   * - Shipped:
   *   - class fields / methods
   *   - static initializer block
   *   - everything else natively supported
   */
  let ast = babelParser.parse(source, { sourceType: 'module' });

  BABLE_CACHE.set(source, ast);

  return ast;
}

/**
 * For js and ts with hbs`` templates
 *
 * @param {string} source
 * @returns {TemplateInfo[]}
 */
export function templateInfoForScript(source) {
  let ast = parseWithBabel(source);

  let templateInfos = [];

  babelTraverse.default(ast, {
    TaggedTemplateExpression(path) {
      if (path.node.tag.name !== 'hbs') {
        return;
      }

      let node = path.node;
      let columnOffset = node.quasi.loc.start.column;
      let templateNode = node.quasi.quasis[0];
      let raw = templateNode.value.raw;
      let loc = templateNode.loc;

      templateInfos.push({
        ...makeTemplateInfo(
          {
            line: loc.start.line,
            column: loc.start.column,
            columnOffset,
            start: loc.start.index,
            end: loc.end.index,
          },
          raw
        ),
        isStrictMode: false,
      });
    },
  });

  return templateInfos;
}


export async function asyncMapOverTemplatesInScript(source, transform) {
  let replacements = new Map();

  let infos = templateInfoForScript(source);

  for (let info of infos) {
    let result = await transform(info.template, info);

    replacements.set(info.template, result);
  }

  let ast = parseWithBabel(source);

  babelTraverse.default(ast, {
    TaggedTemplateExpression(path) {
      if (path.node.tag.name !== 'hbs') {
        return;
      }

      let node = path.node;
      let valueNode = node.quasi.quasis[0].value;
      let raw = valueNode.raw;

      let replacement = replacements.get(raw);

      if (replacement) {
        valueNode.raw = replacement;
      }
    }
  })

  return source;
}

/**
 * @param {object} location
 * @param {number} location.line
 * @param {number} location.column
 * @param {string} template
 *
 * @returns {TemplateInfo}
 */
function makeTemplateInfo(location, template) {
  let { line, column, start, end, columnOffset } = location;
  return {
    line,
    start,
    end,
    column,
    columnOffset,
    template,
    isEmbedded: true,
    isStrictMode: true,
  };
}

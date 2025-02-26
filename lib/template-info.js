/**
 * This whole file should be deleted in the next major
 * We don't want to be linting js/ts (with hbs)
 *
 * This file is soooorta a subset of content-tag-utils
 */
import * as babelParser from '@babel/parser';
import * as babelTraverse from '@babel/traverse';
import * as babelGenerator from '@babel/generator';

// Babel is published incorrectly, so... we work around trying to get access to the functions we need
function peelExportOffIncorrectlyCompiledModule(mod, name) {
  if (name in mod) {
    let result = mod[name];

    if (name !== 'default') {
      return result;
    }

    mod = result;
  }

  if ('default' in mod) {
    return peelExportOffIncorrectlyCompiledModule(mod.default, name);
  }

  return mod;
}
const parse = peelExportOffIncorrectlyCompiledModule(babelParser, 'parse');
const traverse = peelExportOffIncorrectlyCompiledModule(babelTraverse, 'default');
const generate = peelExportOffIncorrectlyCompiledModule(babelGenerator, 'default');

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
export function reverseInnerCoordinatesOf(templateCoordinates, innerCoordinates) {
  const line = innerCoordinates.line + templateCoordinates.line - 1;
  const endLine = innerCoordinates.endLine + templateCoordinates.line - 1;

  const column =
    innerCoordinates.line === 1
      ? innerCoordinates.column + templateCoordinates.column
      : innerCoordinates.column;
  const endColumn =
    innerCoordinates.line === 1
      ? innerCoordinates.endColumn + templateCoordinates.column
      : innerCoordinates.endColumn;

  return {
    line,
    endLine,
    column,
    endColumn,
  };
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
  let ast = parse(source, {
    sourceType: 'module',
    strictMode: true,
    tokens: true,
    plugins: [
      [
        'typescript',
        {
          allExtensions: true,
          onlyRemoveTypeImports: true,
          allowDeclareFields: true,
        },
      ],
    ],
  });

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

  let currentIndentation = [];
  traverse(ast, {
    ExpressionStatement: {
      enter(path) {
        let indent = path.node.loc.start.column;
        currentIndentation.push(indent);
      },
      exit() {
        currentIndentation.pop();
      },
    },
    TaggedTemplateExpression(path) {
      if (path.node.tag.name !== 'hbs') {
        return;
      }

      let node = path.node;
      let columnOffset = currentIndentation.at(-1) ?? 0;
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

  traverse(ast, {
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
        valueNode.cooked = replacement;
      }
    },
  });

  let result = generate(
    ast,
    {
      /**
       * Using babel for linting like this is probably unsafe.
       */
      experimental_preserveFormat: true,
      retainLines: true,
      retainFunctionParens: true,
    },
    source
  );

  return result.code;
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

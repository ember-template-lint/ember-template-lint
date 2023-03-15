import { parseTemplates } from 'ember-template-imports/lib/parse-templates.js';
import * as util from 'ember-template-imports/src/util.js';

export const SUPPORTED_EXTENSIONS = ['.js', '.ts', '.gjs', '.gts'];
const LOCATION_START = Object.freeze({ line: 0, column: 0, start: 0, end: 0, columnOffset: 0 });
/**
 * Processes results and corrects for template location offsets.
 *
 * @typedef {object} TemplateInfo
 * @property {number} line
 * @property {number} column
 * @property {string} template
 * @property {boolean} isEmbedded
 *
 * @param {string} moduleSource
 * @param {string} relativePath
 *
 * @returns {TemplateInfo[]}
 */
export function extractTemplates(moduleSource, relativePath) {
  // If no relativePath is present, assuming we might have templates.
  let mightHaveTemplates = relativePath ? isSupportedScriptFileExtension(relativePath) : true;

  if (!mightHaveTemplates) {
    return [makeTemplateInfo(LOCATION_START, moduleSource)];
  }

  let parsed = parseTemplates(moduleSource, relativePath, {
    templateTag: util.TEMPLATE_TAG_NAME,
    templateLiteral: [
      {
        importPath: 'ember-cli-htmlbars',
        importIdentifier: 'hbs',
      },
      {
        importPath: '@ember/template-compilation',
        importIdentifier: 'hbs',
      },
      {
        importPath: '@glimmerx/component',
        importIdentifier: 'hbs',
      },
      {
        importPath: util.TEMPLATE_LITERAL_MODULE_SPECIFIER,
        importIdentifier: util.TEMPLATE_LITERAL_IDENTIFIER,
      },
      {
        importPath: 'ember-cli-htmlbars-inline-precompile',
        importIdentifier: 'default',
      },
      {
        importPath: 'htmlbars-inline-precompile',
        importIdentifier: 'default',
      },
      {
        importPath: '@ember/template-compilation',
        importIdentifier: 'precompileTemplate',
      },
    ],
  });

  // If after parsing we found no templates and we had no relative path,
  // then we assume we had a hbs file in input.
  if (parsed.length === 0 && !relativePath) {
    return [makeTemplateInfo(LOCATION_START, moduleSource)];
  }

  let result = parsed.map((templateInfo) => {
    let { start, end } = templateInfo;
    let templateStart = start.index + start[0].length;

    return makeTemplateInfo(
      coordinatesOf(moduleSource, templateStart, start.index, end.index),
      templateInfo.contents,
      templateInfo,
      true
    );
  });

  return result;
}

/**
 * @param {object} location
 * @param {number} location.line
 * @param {number} location.column
 * @param {string} template
 * @param {object} templateInfo
 * @param {boolean} isEmbedded
 *
 * @returns {TemplateInfo}
 */
function makeTemplateInfo(
  { line, column, start, end, columnOffset },
  template,
  templateInfo,
  isEmbedded
) {
  return {
    line,
    start,
    end,
    column,
    columnOffset,
    template,
    isEmbedded,
    isStrictMode: !isEmbedded || isStrictMode(templateInfo),
    templateMatch: templateInfo,
  };
}

/**
 * @param {object} templateInfo
 *
 * @returns {boolean}
 */
export function isStrictMode(templateInfo) {
  return (
    (templateInfo.importIdentifier === util.TEMPLATE_LITERAL_IDENTIFIER &&
      templateInfo.importPath === util.TEMPLATE_LITERAL_MODULE_SPECIFIER) ||
    templateInfo.type === 'template-tag'
  );
}

export function isSupportedScriptFileExtension(filePath = '') {
  return SUPPORTED_EXTENSIONS.some((ext) => filePath.endsWith(ext));
}

export function coordinatesOf(text, offset, start, end) {
  const contentBeforeTemplateStart = text.slice(0, offset).split('\n');
  const lineBeforeTemplateStart = contentBeforeTemplateStart[contentBeforeTemplateStart.length - 1];
  return {
    line: contentBeforeTemplateStart.length,
    column: lineBeforeTemplateStart.length,
    start,
    end,
    columnOffset: lineBeforeTemplateStart.length - lineBeforeTemplateStart.trimStart().length,
  };
}

/**
 * @param {TemplateInfo} templateInfo
 * @param {object} result
 * @param {number} result.line
 * @param {number} result.endLine
 * @param {number} result.column
 * @param {number} result.endColumn
 *
 * @returns {object}
 */
export function coordinatesOfResult(templateInfo, result) {
  /**
   * Given the sample source code:
   * 1 import { hbs } from 'ember-cli-htmlbars'\n
   * 2 export class SomeComponent extends Component<Args> {\n
   * 3     <template>\n
   * 4         {{debugger}}\n
   * 5     </template>\n
   * 6 }
   *
   * The extracted template will be:
   * 1 \n
   * 2    {{debugger}}\n
   *
   * The coordinates of the template in the source file are: { line: 3, column: 14 }.
   * The coordinates of the error in the template are: { line: 2, column: 4 }.
   *
   * Thus, we need to always subtract one before adding the template location.
   */
  const line = result.line + templateInfo.line - 1;
  const endLine = result.endLine + templateInfo.line - 1;

  /**
   * Given the sample source code:
   * 1 import { hbs } from 'ember-cli-htmlbars'\n
   * 2 export class SomeComponent extends Component<Args> {\n
   * 3     <template>{{debugger}}\n
   * 4     </template>\n
   * 5 }
   *
   * The extracted template will be:
   * 1 {{debugger}}\n
   *
   * The coordinates of the template in the source file are: { line: 3, column: 14 }.
   * The coordinates of the error in the template are: { line: 1, column: 0 }.
   *
   * Thus, if the error is found on the first line of a template,
   * then we need to add the column location to the result column location.
   *
   * Any result > line 1 will not require any column correction.
   */
  const column = result.line === 1 ? result.column + templateInfo.column : result.column;
  const endColumn = result.line === 1 ? result.endColumn + templateInfo.column : result.endColumn;

  return {
    line,
    endLine,
    column,
    endColumn,
  };
}

import { Preprocessor } from 'content-tag';

export const SUPPORTED_EXTENSIONS = ['.gjs', '.gts'];
const p = new Preprocessor();
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
    return [];
  }

  // early exit if we don't have </template>
  // this is a small speed boost for gjs/gts that don't define components.

  if (!moduleSource.includes('</template>')) {
    return [];
  }

  let parsed = p.parse(moduleSource);

  // If after parsing we found no templates and we had no relative path,
  // then we have a GJS/GTS with no <template>.
  if (parsed.length === 0 && !relativePath) {
    return [];
  }

  let result = parsed.map((templateInfo) => {
    let { range } = templateInfo;

    let buffer = Buffer.from(moduleSource, 'utf8');
    let bufferSliced = buffer.slice(range.start, range.end).toString();
    let before = buffer.slice(0, range.start).toString().length;
    let startCharIndex = before;
    let endCharIndex = before + bufferSliced.length;

    return makeTemplateInfo(
      coordinatesOf(moduleSource, before, startCharIndex, endCharIndex),
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
    isStrictMode: true,
    templateMatch: templateInfo,
  };
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
   * 1 export class SomeComponent extends Component<Args> {\n
   * 2     <template>\n
   * 3         {{debugger}}\n
   * 4     </template>\n
   * 5 }
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
   * 1 export class SomeComponent extends Component<Args> {\n
   * 2     <template>{{debugger}}\n
   * 3     </template>\n
   * 4 }
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

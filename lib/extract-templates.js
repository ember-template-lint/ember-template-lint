import { Preprocessor } from 'content-tag';

export const SUPPORTED_EXTENSIONS = ['.gjs', '.gts'];
const HBS = '.hbs';
const HTML = '.html';
const LOCATION_START = Object.freeze({ line: 1, column: 0, start: 0, end: 0, columnOffset: 0 });

const p = new Preprocessor();

export function isSupported(filePath = '') {
  return isGlimmerFileExtension(filePath) || isHBS(filePath) || isHTML(filePath);
}

export function isGlimmerFileExtension(filePath = '') {
  return SUPPORTED_EXTENSIONS.some((ext) => filePath.endsWith(ext));
}

export function isHBS(filePath = '') {
  return filePath.endsWith(HBS);
}

function isHTML(filePath = '') {
  return filePath.endsWith(HTML);
}

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
  let isGlimmer = isGlimmerFileExtension(relativePath);

  if (!isGlimmer) {
    if (isHBS(relativePath) || isHTML(relativePath)) {
      return [
        {
          ...makeTemplateInfo(
            {
              ...LOCATION_START,
              end: moduleSource.length - 1,
            },
            moduleSource
          ),
          isEmbedded: undefined,
          isStrictMode: false,
        },
      ];
    }
  }

  // early exit if we don't have </template>
  // this is a small speed boost for gjs/gts that don't define components.

  if (!moduleSource.includes('</template>')) {
    return [];
  }

  let parsed = p.parse(moduleSource, { inline_source_map: false, filename: relativePath });

  // If after parsing we found no templates and we had no relative path,
  // then we have a GJS/GTS with no <template>.
  if (parsed.length === 0 && !relativePath) {
    return [];
  }

  const result = parsed.map((templateInfo) => {
    const coordinates = coordinatesOf(moduleSource, templateInfo);

    return makeTemplateInfo(coordinates, templateInfo.contents, templateInfo);
  });

  return result;
}

export function replaceTemplates(originalSource, transforms) {
  // Will be added to or subtracted from depending on the change
  // in character length each of the transforms
  let offset = 0;
  let result = originalSource;

  // templateInfo.templateMatch is https://github.com/embroider-build/content-tag/blob/main/index.d.ts#L7
  // "Parsed"
  for (let { templateInfo, transformed } of transforms) {
    let buffer = Buffer.from(originalSource, 'utf8');
    let parsed = templateInfo.templateMatch;

    /**
     * NOTE: range.start w/ range.end is between the <template> and </template>
     */
    let originalContent = buffer.slice(parsed.range.start, parsed.range.end).toString();
    let originalLength = originalContent.length;
    let originalBeforeContent = buffer.slice(0, parsed.range.start).toString();
    let originalStart = originalBeforeContent.length;
    let originalEnd = originalStart + originalLength;

    /**
     * Need to make sure the opening <template> and closing </template>
     * are not removed.
     *
     * We aren't just using the strings <template> and </template>, because
     * its possible for the opening <template ..... > to have attributes in the future
     * with futher syntax extensions
     * - Signature
     * - defaults?
     * - macros?
     * template-lint doesn't care for the most part (for now?), but we don't want to chop off that
     * exploration.
     */
    let openingTag = buffer.slice(parsed.startRange.start, parsed.startRange.end).toString();
    let closingTag = buffer.slice(parsed.endRange.start, parsed.endRange.end).toString();

    result =
      result.slice(0, originalStart + offset) +
      openingTag +
      transformed +
      closingTag +
      result.slice(originalEnd + offset, result.length);

    offset = transformed.length - originalLength;
  }

  return result;
}

/**
 * @param {object} location
 * @param {number} location.line
 * @param {number} location.column
 * @param {string} template
 * @param {object} parsed
 *
 * @returns {TemplateInfo}
 */
function makeTemplateInfo(location, template, parsed) {
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
    templateMatch: parsed,
  };
}

/**
 * Coordinates of the <template>...</template> (exclusive)
 * For formatting the positions of <template> and </template>, folks should use prettier
 */
export function coordinatesOf(text, templateInfo) {
  /**
   * range is the full range, including the leading and trailing <tempalte>,</template>
   * contentRange is the range between / excluding the leading and trailing <template>,</template>
   */
  let { contentRange: byteRange } = templateInfo;
  let buffer = Buffer.from(text, 'utf8');
  let inclusiveContent = buffer.slice(byteRange.start, byteRange.end).toString();
  let beforeContent = buffer.slice(0, byteRange.start).toString();
  let before = beforeContent.length;

  let startCharIndex = before;
  let endCharIndex = before + inclusiveContent.length;

  const contentBeforeTemplateStart = beforeContent.split('\n');
  const lineBeforeTemplateStart = contentBeforeTemplateStart.at(-1);

  /**
   * Reminder:
   *   Rows are 1-indexed
   *   Columns are 0-indexed
   *
   * (for when someone inevitably needs to debug this and is comparing
   *  with their editor (editors typically use 1-indexed columns))
   */
  return {
    line: contentBeforeTemplateStart.length,
    column: lineBeforeTemplateStart.length,
    // character index, not byte index
    start: startCharIndex,
    // character index, not byte index
    end: endCharIndex,
    // any indentation of the <template> parts (class indentation etc)
    columnOffset: lineBeforeTemplateStart.length - lineBeforeTemplateStart.trimStart().length,
  };
}

/**
 * Converts between <template> results to coordinates in the original file
 *
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

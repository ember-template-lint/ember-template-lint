import { parseTemplates } from 'ember-template-imports/lib/parse-templates.js';

const extensions = ['js', 'ts', 'gjs', 'gts'];
const LOCATION_START = Object.freeze({ line: 0, column: 0 });
/**
 * @typedef {object} TemplateInfo
 * @property {number} line
 * @property {number} column
 * @property {string} template
 * @property {boolean} isEmbedded
 *
 *
 * @param {string} moduleSource
 * @param {string} relativePath
 *
 * @returns {TemplateInfo[]}
 */
export function extractTemplates(moduleSource, relativePath) {
  // If no relativePath is present, assuming we might have templates.
  let mightHaveTemplates = relativePath
    ? extensions.some((ext) => relativePath.endsWith(ext))
    : true;

  if (!mightHaveTemplates) {
    return [makeTemplateInfo(LOCATION_START, moduleSource)];
  }

  let parsed = parseTemplates(moduleSource, relativePath, 'template');

  // If after parsing we found no templates and we had no relative path,
  // then we assume we had a hbs file in input.
  if (parsed.length === 0 && !relativePath) {
    return [makeTemplateInfo(LOCATION_START, moduleSource)];
  }

  let result = parsed.map(templateInfo => {
    let { start, end } = templateInfo;
    let templateStart = start.index + start[0].length;

    let template = moduleSource.slice(templateStart, end.index);

    return makeTemplateInfo(
      coordinatesOf(moduleSource, templateStart, end.index),
      template,
      true);
  });

  return result;
}


/**
 * @param {object} location
 * @param {number} location.line
 * @param {number} location.column
 * @param {string} template
 * @param {boolean} isEmbedded
 *
 * @returns {TemplateInfo}
 */
function makeTemplateInfo({line, column}, template, isEmbedded) {
  return {
    line,
    column,
    template,
    isEmbedded,
  };
}

export function coordinatesOf(text, offset) {
  const contentBeforeTemplateStart = text.slice(0, offset).split('\n');
  return {
    line: contentBeforeTemplateStart.length,
    column: contentBeforeTemplateStart[contentBeforeTemplateStart.length - 1].length
  };
}

export function coordinatesOfResult(templateInfo, result) {
  if (templateInfo.isEmbedded) {
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
     if (result.line === 1) {
      result.column += templateInfo.column;
      result.endColumn += templateInfo.column;
    }
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
    result.line += templateInfo.line - 1;
    result.endLine += templateInfo.line - 1;
  }
}
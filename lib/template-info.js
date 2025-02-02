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
 * For js and ts with hbs`` templates
 *
 * @param {string} source
 * @returns {TemplateInfo[]}
 */
export function templateInfoForScript(/* source */) {
  // TODO: need to finish for this PR to be non-breaking

  return [];
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

// import { getTemplateLocals } from '@glimmer/syntax';
import { parseTemplates } from 'ember-template-imports/lib/parse-templates.js';
// import { preprocessEmbeddedTemplates } from 'ember-template-imports/lib/preprocess-embedded-templates.js';
// import * as util from 'ember-template-imports/src/util.js';

const extensions = ['js', 'ts', 'gjs', 'gts'];
/**
 * @typedef {object} TemplateInfo
 * @property {number} line
 * @property {number} column
 * @property {string} template
 *
 *
 * @param {string} moduleSource
 * @param {string} relativePath
 *
 * @returns {TemplateInfo[]}
 */
export function extractTemplates(moduleSource, relativePath) {
  // If no relativePath is present, assuming we might have templates.
  let mightHaveTemplates = relativePath ? extensions.some((ext) => relativePath.endsWith(ext)) : true;

  if (!mightHaveTemplates) {
    return [{ line: 0, column: 0, template: moduleSource }];
  }

  let result = [];

  // const preprocessed = preprocessEmbeddedTemplates(moduleSource, {
  //   getTemplateLocals,
  //   relativePath,

  //   templateTag: util.TEMPLATE_TAG_NAME,
  //   templateTagReplacement: util.TEMPLATE_TAG_PLACEHOLDER,

  //   includeSourceMaps: false,
  //   includeTemplateTokens: true,
  // });

  let parsed = parseTemplates(moduleSource, relativePath, 'template');

  // If after parsing we find no templates, and we had no relative path, then we assuming we had a hbs file in input.
  if (parsed.length === 0 && !relativePath) {
    return [{ line: 0, column: 0, template: moduleSource }];
  }

  for (let templateInfo of parsed) {
    let { start, end } = templateInfo;
    let templateStart = start.index + start[0].length;

    let template = moduleSource.slice(templateStart, end.index);

    result.push({
      ...startCoordinates(moduleSource, templateStart),
      // ...endCoordinates(moduleSource, end.index),
      template,
    });
  }

  return result;
}

function startCoordinates(text, offset) {
  let { line, column } = coordinatesOf(text, offset);

  return {
    line,
    column,
  };
}

// function endCoordinates(text, offset) {
//   let { line: endLine, column: endColumn } = coordinatesOf(text, offset);

//   return {
//     endLine,
//     endColumn,
//   };
// }

function coordinatesOf(text, offset) {
  let lines = text.split('\n');

  let line = 0;
  let column = 0;
  let previousOffset = 0;

  for (let currentLine of lines) {
    if (previousOffset + currentLine.length > offset) {
      column = offset - previousOffset;
      break;
    }

    previousOffset += currentLine.length;
    line += 1;
  }

  // This is wrong? :confused:
  return { line: line - 1, column };
}

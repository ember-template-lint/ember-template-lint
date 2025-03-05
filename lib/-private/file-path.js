import { parse } from 'node:path';

const DTS = '.d.ts';
export const GJS = ['.gjs', '.gts'];
const HBS = '.hbs';
const HTML = '.html';
export const SOON_DEPRECATED = ['.js', '.ts'];

function isDTS(ext) {
  return ext.endsWith(DTS);
}

function isGlimmerScript(ext) {
  return GJS.includes(ext);
}

function isHBS(ext) {
  return ext === HBS;
}

function isHTML(ext) {
  return ext === HTML;
}

function isScript(ext) {
  return SOON_DEPRECATED.includes(ext);
}

export function canProcessFile(filePath) {
  if (!filePath) {
    return false;
  }

  const { ext } = parseFilePath(filePath);

  return isDTS(ext) || isGlimmerScript(ext) || isHBS(ext) || isHTML(ext) || isScript(ext);
}

export function parseFilePath(filePath) {
  let { base, dir, ext, name } = parse(filePath);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { ext: extPrefix, name: fileName } = parse(name);

    if (extPrefix === '') {
      break;
    }

    ext = `${extPrefix}${ext}`;
    name = fileName;
  }

  return { base, dir, ext, name };
}

export async function processFile(filePath = '', tasks) {
  const { ext } = parseFilePath(filePath);

  if (isGlimmerScript(ext)) {
    return await tasks.glimmerScript();
  }

  if (isHBS(ext) || isHTML(ext)) {
    return await tasks.template();
  }

  if (isScript(ext)) {
    return await tasks.script();
  }

  return await tasks.default();
}

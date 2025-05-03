import { parse } from 'node:path';

const DTS = '.d.ts';
export const GJS = ['.gjs', '.gts'];
const HBS = '.hbs';
const HTML = '.html';
export const SOON_DEPRECATED = ['.js', '.ts'];

export function isDTS(ext) {
  return ext.endsWith(DTS);
}

function isGlimmerScript(ext) {
  return GJS.includes(ext);
}

function isHBS(ext) {
  return ext.endsWith(HBS);
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

  const { ext, shortExt } = parseFilePath(filePath);

  if (isDTS(ext)) {
    return true;
  }

  return isGlimmerScript(shortExt) || isHBS(shortExt) || isHTML(shortExt) || isScript(shortExt);
}

/**
 * Parses a file path, similarly to `parse()` from `node:path`,
 * but correctly handles file extensions with more than one `.`,
 * e.g. `.d.ts` and `.css.d.ts`.
 *
 * @param {string} filePath
 *
 * A file path.
 *
 * @return
 *
 * An object with `base`, `dir`, `ext`, `shortExt`, and `name`.
 *
 * @example
 *
 * ```ts
 * const filePath = 'src/components/navigation-menu.d.ts';
 * const { base, dir, ext, name } = parseFilePath(filePath);
 *
 * // base     -> 'navigation-menu.d.ts'
 * // dir      -> 'src/components'
 * // ext      -> '.d.ts'
 * // shortExt -> '.ts'
 * // name     -> 'navigation-menu'
 * ```
 */
export function parseFilePath(filePath) {
  let { base, dir, ext, name } = parse(filePath);

  const shortExt = ext;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { ext: extPrefix, name: fileName } = parse(name);

    if (extPrefix === '') {
      break;
    }

    ext = `${extPrefix}${ext}`;
    name = fileName;
  }

  return { base, dir, ext, shortExt, name };
}

export async function processFile(filePath = '', tasks) {
  const { ext, shortExt } = parseFilePath(filePath);

  for (let extension of [ext, shortExt]) {
    if (isGlimmerScript(extension)) {
      return await tasks.glimmerScript();
    }

    if (isHBS(extension) || isHTML(extension)) {
      return await tasks.template();
    }

    if (isScript(extension)) {
      return await tasks.script();
    }
  }

  return await tasks.default();
}

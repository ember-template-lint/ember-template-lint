export const GJS = ['.gjs', '.gts'];
const HBS = '.hbs';
const HTML = '.html';
export const SOON_DEPRECATED = ['.js', '.ts'];
const DTS = '.d.ts';

export function isSupported(filePath = '') {
  return (
    isGlimmerFileExtension(filePath) || isHBS(filePath) || isHTML(filePath) || isScript(filePath)
  );
}

export function isScript(filePath = '') {
  if (filePath.endsWith(DTS)) {
    return false;
  }

  return SOON_DEPRECATED.some((ext) => filePath.endsWith(ext));
}

export function isGlimmerFileExtension(filePath = '') {
  return GJS.some((ext) => filePath.endsWith(ext));
}

export function isHBS(filePath = '') {
  return filePath.endsWith(HBS);
}

export function isHTML(filePath = '') {
  return filePath.endsWith(HTML);
}

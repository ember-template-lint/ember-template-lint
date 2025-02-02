export const SUPPORTED_EXTENSIONS = ['.gjs', '.gts'];
const HBS = '.hbs';
const HTML = '.html';
const SOON_DEPRECATED = ['.js', '.ts'];

export function isSupported(filePath = '') {
  return (
    isGlimmerFileExtension(filePath) || isHBS(filePath) || isHTML(filePath) || isScript(filePath)
  );
}

export function isScript(filePath = '') {
  return SOON_DEPRECATED.some((ext) => filePath.endsWith(ext));
}

export function isGlimmerFileExtension(filePath = '') {
  return SUPPORTED_EXTENSIONS.some((ext) => filePath.endsWith(ext));
}

export function isHBS(filePath = '') {
  return filePath.endsWith(HBS);
}

export function isHTML(filePath = '') {
  return filePath.endsWith(HTML);
}

function transformTagName(tagName, isLocal) {
  if (tagName.startsWith('@') || tagName.startsWith('this.') || isLocal) {
    return tagName;
  }

  if (isNestedComponentTagName(tagName)) {
    return transformNestedTagName(tagName);
  }

  return capitalizedTagName(tagName);
}

function isNestedComponentTagName(tagName) {
  let nestedComponentName = /\//g;
  return nestedComponentName.test(tagName);
}

function transformNestedTagName(tagName) {
  let paths = tagName.split('/');
  return paths.map((name) => capitalizedTagName(name)).join('::');
}

function capitalizedTagName(tagName) {
  const SIMPLE_DASHERIZE_REGEXP = /[a-z]|\//g;
  const ALPHA = /[\dA-Za-z]/;

  tagName = tagName.replace(SIMPLE_DASHERIZE_REGEXP, (char, index) => {
    if (char === '/') {
      return '::';
    }

    if (index === 0 || !ALPHA.test(tagName[index - 1])) {
      return char.toUpperCase();
    }

    return char.toLowerCase();
  });
  // Remove all occurrences of '-'s from the tagName
  return tagName.replace(/-/g, '');
}

export { transformTagName, isNestedComponentTagName };

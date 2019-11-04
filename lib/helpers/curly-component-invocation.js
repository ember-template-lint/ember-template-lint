function transformTagName(tagName) {
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
  return paths.map(name => capitalizedTagName(name)).join('::');
}

function capitalizedTagName(tagName) {
  const SIMPLE_DASHERIZE_REGEXP = /[a-z]|\//g;
  const ALPHA = /[A-Za-z0-9]/;

  tagName = tagName.replace(SIMPLE_DASHERIZE_REGEXP, (char, index) => {
    if (char === '/') {
      return '::';
    }

    if (index === 0 || !ALPHA.test(tagName[index - 1])) {
      return char.toUpperCase();
    }

    return char.toLowerCase();
  });
  // Remove all occurances of '-'s from the tagName
  return tagName.replace(/-/g, '');
}

module.exports = {
  transformTagName,
  isNestedComponentTagName,
};

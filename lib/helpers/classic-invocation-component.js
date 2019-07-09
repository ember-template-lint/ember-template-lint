function transformTagName(tagName) {
  if (isNestedComponentTagName(tagName)) {
    return transformNestedTagName(tagName);
  }

  return capitalizedTagName(tagName);
}

function isComponentTagName(tagName) {
  let hyphenatedComponentName = /\w+-\w+/g;
  return hyphenatedComponentName.test(tagName);
}

function isNestedComponentTagName(tagName) {
  let nestedComponentName = /\//g;
  return nestedComponentName.test(tagName);
}

function transformNestedTagName(tagName) {
  let paths = tagName.split('/');
  return paths.map(name => capitalizedTagName(name)).join('::');
}

function capitalizedTagName(tagname) {
  if (tagname.includes('@')) {
    tagname = tagname
      .split('@')
      .map(upperCase)
      .join('@');
  }

  return tagname
    .split('-')
    .map(upperCase)
    .join('');
}

function upperCase(text) {
  return text[0].toUpperCase() + text.slice(1);
}

module.exports = {
  transformTagName,
  isComponentTagName,
  isNestedComponentTagName,
};

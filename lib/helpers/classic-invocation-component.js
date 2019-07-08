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
  return tagname
    .split('-')
    .map(s => {
      return s[0].toUpperCase() + s.slice(1);
    })
    .join('');
}

module.exports = {
  transformTagName,
  isComponentTagName,
  isNestedComponentTagName,
};

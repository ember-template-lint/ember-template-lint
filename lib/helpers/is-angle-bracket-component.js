'use strict';

function isDynamicComponent(element) {
  let open = element.tag.charAt(0);

  let maybeLocal = element.tag.split('.').length > 1;
  let isNamedArgument = open === '@';
  let isThisPath = element.tag.indexOf('this.') === 0;
  return maybeLocal || isNamedArgument || isThisPath;
}

module.exports = function isAngleBracketComponent(element) {
  let open = element.tag.charAt(0);
  let isPath = element.tag.indexOf('.') > -1;

  let isUpperCase = open === open.toUpperCase() && open !== open.toLowerCase();

  return (isUpperCase && !isPath) || isDynamicComponent(element);
};

'use strict';

// Source: jscodeshift/src/matchNode.js
const hasOwn = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

function isNode(value) {
  return typeof value === 'object' && value !== null;
}

function matchNode(haystack, needle) {
  if (typeof needle === 'function') {
    return needle(haystack);
  }
  if (isNode(needle) && isNode(haystack)) {
    return Object.keys(needle).every(function (property) {
      return hasOwn(haystack, property) && matchNode(haystack[property], needle[property]);
    });
  }
  return haystack === needle;
}

// Source: jscodeshift/src/core.js
function matchOne(path, filter) {
  if (typeof path.get === 'function') {
    path = path.get();
  } else {
    path = { value: path };
  }
  return matchNode(path.value, filter);
}

function match(testNode, ref) {
  if (!testNode || !ref) {
    return;
  }
  if (Array.isArray(ref)) {
    return ref.some((refNode) => matchOne(testNode, refNode));
  } else {
    return matchOne(testNode, ref);
  }
}

module.exports.match = match;

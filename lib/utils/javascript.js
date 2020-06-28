'use strict';

module.exports = {
  duplicateArrays,
  flatten,
  flatMap,
  removeWhitespace,
};

/**
 * duplicateArrays([["a", "b"]], 2) -> [["a", "b"], ["a", "b"], ["a", "b"]]
 * @param {Array<Array>} arr
 * @param {number} times
 * @returns {Array<Array>}
 */
function duplicateArrays(arr, times) {
  const result = [];
  for (let i = 0; i <= times; i++) {
    result.push(...arr.map((a) => a.slice(0)));
  }
  return result;
}

/**
 * Flattens an array.
 * WARNING: can only handle one level of nested arrays.
 * Input: [[1], [2]]
 * Output: [1, 2]
 *
 * @param  {Object[]} arr Array to flatten.
 * @return {Object[]}     Flattened array.
 */
function flatten(arr) {
  if (!arr || arr.length === 0) {
    return arr;
  }

  return arr.reduce((acc, val) => acc.concat(val));
}

/**
 * Builds an array by concatenating the results of a map.
 *
 * @template T, U
 * @param {Array<T>} array
 * @param {function(T): Array<U>} callback
 * @returns {Array<U>}
 */
function flatMap(array, callback) {
  return array.reduce((result, item) => result.concat(callback(item)), []);
}

function removeWhitespace(str) {
  // Removes whitespace anywhere inside string.
  return str.replace(/\s/g, '');
}

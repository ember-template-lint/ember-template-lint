'use strict';

module.exports = {
  flat,
  flatMap,
};

/**
 * Flattens an array.
 * WARNING: can only handle one level of nested arrays.
 * Input: [[1], [2]]
 * Output: [1, 2]
 *
 * @param  {Object[]} arr Array to flatten.
 * @return {Object[]}     Flattened array.
 */
function flat(arr) {
  if (!arr || arr.length === 0) {
    return arr;
  }

  return arr.reduce((acc, val) => acc.concat(val)); // eslint-disable-line unicorn/prefer-spread
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
  return array.reduce((result, item) => result.concat(callback(item)), []); // eslint-disable-line unicorn/prefer-spread
}

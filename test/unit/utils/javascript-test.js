'use strict';

const javascriptUtils = require('../../../lib/utils/javascript');

describe('duplicateArrays', () => {
  it('returns the right result', () => {
    expect(javascriptUtils.duplicateArrays([], 2)).toStrictEqual([]);
    expect(javascriptUtils.duplicateArrays(['abc'], 2)).toStrictEqual(['abc', 'abc', 'abc']);
    expect(javascriptUtils.duplicateArrays(['first', 'second'], 2)).toStrictEqual([
      'first',
      'second',
      'first',
      'second',
      'first',
      'second',
    ]);
  });
});

describe('flatten', function () {
  it('correctly flattens arrays', function () {
    expect(javascriptUtils.flatten([])).toStrictEqual([]);
    expect(javascriptUtils.flatten(null)).toBeNull();
    expect(javascriptUtils.flatten([[1], [2]])).toStrictEqual([1, 2]);
    expect(
      javascriptUtils.flatten([
        [1, 2],
        [3, 4],
      ])
    ).toStrictEqual([1, 2, 3, 4]);
    expect(javascriptUtils.flatten([[1], [2, 3], [4, 5, 6]])).toStrictEqual([1, 2, 3, 4, 5, 6]); // different lengths forward
    expect(javascriptUtils.flatten([[6, 5, 4], [3, 2], [1]])).toStrictEqual([6, 5, 4, 3, 2, 1]); // different lengths reverse
    expect(javascriptUtils.flatten([[1], null, [2]])).toStrictEqual([1, null, 2]); // with null array
  });
});

describe('removeWhitespace', () => {
  it('returns the right result', () => {
    expect(javascriptUtils.removeWhitespace('abcdef')).toStrictEqual('abcdef');
    expect(javascriptUtils.removeWhitespace('abc def')).toStrictEqual('abcdef');
    expect(javascriptUtils.removeWhitespace(' abc def ')).toStrictEqual('abcdef');
  });
});

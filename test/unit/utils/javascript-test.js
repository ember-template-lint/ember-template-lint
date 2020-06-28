'use strict';

const javascriptUtils = require('../../../lib/utils/javascript');

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

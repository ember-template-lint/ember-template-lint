'use strict';

const nodeMatchesRef = require('../../../lib/helpers/node-match').nodeMatchesRef;
const nodeMatchesValidRef = require('../../../lib/helpers/node-match').nodeMatchesValidRef;

describe('Single Node-Ref Matches', function () {
  it('Exact Matches', function () {
    let test = { a: 1, b: { c: 3, d: 4 } };
    let ref = { a: 1, b: { c: 3, d: 4 } };
    let res = nodeMatchesRef(test, ref);
    expect(res).toBe(true);
  });

  it('testNode match (k+v) with excess', function () {
    let test = { a: 1, b: { c: 3, d: 4 }, d: 5 };
    let ref = { a: 1, b: { c: 3, d: 4 } };
    let res = nodeMatchesRef(test, ref);
    expect(res).toBe(true);
  });

  it('testNode match (k only)', function () {
    let test = { a: 2, b: { c: 3, d: 4 } };
    let ref = { a: 1, b: { c: 3, d: 4 } };
    let res = nodeMatchesRef(test, ref);
    expect(res).toBe(false);
  });

  it('testNode non-match (-k)', function () {
    let test = { a: 2, b: { c: 3 } };
    let ref = { a: 1, b: { c: 3, d: 4 } };
    let res = nodeMatchesRef(test, ref);
    expect(res).toBe(false);
  });
});

describe('Multiple Valid Refs Possible', function () {
  it('Exact Match', function () {
    let test = { a: 1, b: { c: 3, d: 4 } };
    let refs = [
      { a: 1, b: { c: 3, d: 4 } },
      { a: 2, b: { c: 3, d: 6 } },
      { a: 'dog', b: { c: 3, d: 7 } },
    ];
    let res = nodeMatchesValidRef(test, refs);
    expect(res).toBe(true);
  });
});

'use strict';

const nodeMatchesRefNode = require('../../../lib/helpers/node-match').nodeMatchesRef;
const nodeMatchesValidRefNode = require('../../../lib/helpers/node-match').nodeMatchesValidRef;

describe('testNode matched against single refNode', function () {
  it('Exact Match', function () {
    let testNode = { a: 1, b: { c: 3, d: 4 } };
    let refNode = { a: 1, b: { c: 3, d: 4 } };
    let result = nodeMatchesRefNode(testNode, refNode);
    expect(result).toBe(true);
  });

  it('testNode match (k+v) with excess', function () {
    let testNode = { a: 1, b: { c: 3, d: 4 }, d: 5 };
    let refNode = { a: 1, b: { c: 3, d: 4 } };
    let result = nodeMatchesRefNode(testNode, refNode);
    expect(result).toBe(true);
  });

  it('testNode match (k only)', function () {
    let testNode = { a: 2, b: { c: 3, d: 4 } };
    let refNode = { a: 1, b: { c: 3, d: 4 } };
    let result = nodeMatchesRefNode(testNode, refNode);
    expect(result).toBe(false);
  });

  it('testNode non-match (-k)', function () {
    let testNode = { a: 2, b: { c: 3 } };
    let refNode = { a: 1, b: { c: 3, d: 4 } };
    let result = nodeMatchesRefNode(testNode, refNode);
    expect(result).toBe(false);
  });
});

describe('Multiple Valid Refs Possible', function () {
  it('Exact Match', function () {
    let testNode = { a: 1, b: { c: 3, d: 4 } };
    let refNodes = [
      { a: 1, b: { c: 3, d: 4 } },
      { a: 2, b: { c: 3, d: 6 } },
      { a: 'dog', b: { c: 3, d: 7 } },
    ];
    let result = nodeMatchesValidRefNode(testNode, refNodes);
    expect(result).toBe(true);
  });
});

'use strict';

const nodeMatchesRefNode = require('../../../lib/helpers/node-match').nodeMatchesRef;
const nodeMatchesValidRefNode = require('../../../lib/helpers/node-match').nodeMatchesValidRef;
const { parse } = require('ember-template-recast');

describe('testNode matched against single refNode', function () {
  it('Match: testNode === refNode, not nested, not parsed', function () {
    let refNode = { type: 'ElementNode', tag: 'div' };
    let testNode = { type: 'ElementNode', tag: 'div' };
    expect(nodeMatchesRefNode(testNode, refNode)).toBe(true);
  });

  it('Match: testNode === refNode, not nested, parsed', function () {
    let refNode = parse('<div id="id-00"></div>').body[0];
    let testNode = parse('<div id="id-00"></div>').body[0];
    expect(nodeMatchesRefNode(testNode, refNode)).toBe(true);
  });

  it('Match: portion(testNode) === refNode, nested, parsed', function () {
    let refNode = {
      type: 'ElementNode',
      tag: 'div',
      attributes: [
        {
          type: 'AttrNode',
          name: 'id',
        },
      ],
    };
    let testNode = parse('<div id="id-00"></div>').body[0];
    let result = nodeMatchesRefNode(testNode, refNode);
    expect(result).toBe(true);
  });

  it('No Match: keys(testNode) === keys(refNode), values(testNode) !== values(refNode)', function () {
    let refNode = { type: 'ElementNode', tag: 'div' };
    let testNode = { type: 'ElementNode', tag: 'img' };
    expect(nodeMatchesRefNode(testNode, refNode)).toBe(false);
  });

  it('No Match: keys(testNode) === keys(refNode), values(testNode) !== values(refNode)', function () {
    let refNode = { type: 'ElementNode', tag: 'div' };
    let testNode = parse('<img />').body[0];
    expect(nodeMatchesRefNode(testNode, refNode)).toBe(false);
  });

  it('No Match: keys(testNode) !== keys(refNode)', function () {
    let refNode = {
      type: 'ElementNode',
      tag: 'div',
      attributes: [
        {
          type: 'AttrNode',
          name: 'aria-label',
        },
      ],
    };
    let testNode = parse('<div id="id-00"></div>').body[0];
    expect(nodeMatchesRefNode(testNode, refNode)).toBe(false);
  });
});

describe('testNode matched against Array containing valid refNodes', function () {
  it('Match: testNode === refNodes[i]', function () {
    let refNodes = [
      { type: 'ElementNode', tag: 'img' },
      { type: 'ElementNode', tag: 'div' },
      { type: 'ElementNode', tag: 'label' },
    ];
    let testNode = { type: 'ElementNode', tag: 'div' };
    expect(nodeMatchesValidRefNode(testNode, refNodes)).toBe(true);
  });

  it('No Match: testNode !== refNodes[i]', function () {
    let refNodes = [
      { type: 'ElementNode', tag: 'img' },
      { type: 'ElementNode', tag: 'input' },
      { type: 'ElementNode', tag: 'label' },
    ];
    let testNode = { type: 'ElementNode', tag: 'div' };
    expect(nodeMatchesValidRefNode(testNode, refNodes)).toBe(false);
  });
});

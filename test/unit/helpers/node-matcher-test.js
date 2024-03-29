import { parse } from 'ember-template-recast';

import { match } from '../../../lib/helpers/node-matcher.js';

describe('testNode matched against single refNode', function () {
  it('Match: testNode === refNode, not nested, not parsed', function () {
    let refNode = { type: 'ElementNode', tag: 'div' };
    let testNode = { type: 'ElementNode', tag: 'div' };
    expect(match(testNode, refNode)).toBe(true);
  });

  it('Match: testNode === refNode, not nested, parsed', function () {
    let refNode = parse('<div id="id-00"></div>').body[0];
    let testNode = parse('<div id="id-00"></div>').body[0];
    expect(match(testNode, refNode)).toBe(true);
  });

  it('Match: portion(testNode) === refNode, nested, parsed', function () {
    let refNode = { type: 'ElementNode', tag: 'div', attributes: [{ name: 'id' }] };
    let testNode = parse('<div id="id-00"></div>').body[0];
    expect(match(testNode, refNode)).toBe(true);
  });

  it('No Match: keys(testNode) === keys(refNode), values(testNode) !== values(refNode)', function () {
    let refNode = { type: 'ElementNode', tag: 'div' };
    let testNode = { type: 'ElementNode', tag: 'img' };
    expect(match(testNode, refNode)).toBe(false);
  });

  it('No Match: keys(testNode) === keys(refNode), values(testNode) !== values(refNode) -- with parse', function () {
    let refNode = { type: 'ElementNode', tag: 'div' };
    let testNode = parse('<img />').body[0];
    expect(match(testNode, refNode)).toBe(false);
  });

  it('No Match: keys(testNode) !== keys(refNode)', function () {
    let refNode = { type: 'ElementNode', tag: 'div', attributes: [{ name: 'class' }] };
    let testNode = parse('<div id="id-00"></div>').body[0];
    expect(match(testNode, refNode)).toBe(false);
  });
});

describe('testNode matched against Array of valid refNodes', function () {
  it('Match: testNode === refNodes[i]', function () {
    let refNodes = [
      { type: 'ElementNode', tag: 'img' },
      { type: 'ElementNode', tag: 'div' },
      { type: 'ElementNode', tag: 'label' },
    ];
    let testNode = { type: 'ElementNode', tag: 'div' };
    expect(match(testNode, refNodes)).toBe(true);
  });

  it('Match: testNode === refNodes[i] - with parse', function () {
    let refNodes = [
      { type: 'ElementNode', tag: 'img' },
      { type: 'ElementNode', tag: 'div' },
      { type: 'ElementNode', tag: 'label' },
    ];
    let testNode = parse('<div id="id-00"></div>').body[0];
    expect(match(testNode, refNodes)).toBe(true);
  });

  it('No Match: testNode !== refNodes[i]', function () {
    let refNodes = [
      { type: 'ElementNode', tag: 'img' },
      { type: 'ElementNode', tag: 'input' },
      { type: 'ElementNode', tag: 'label' },
    ];
    let testNode = { type: 'ElementNode', tag: 'div' };
    expect(match(testNode, refNodes)).toBe(false);
  });
});

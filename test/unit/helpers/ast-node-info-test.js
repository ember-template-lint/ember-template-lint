'use strict';

const { parse } = require('ember-template-recast');

const AstNodeInfo = require('../../../lib/helpers/ast-node-info');

describe('hasChildren', function () {
  it('functions for empty input', function () {
    expect(AstNodeInfo.hasChildren(parse(''))).toBe(false);
  });

  it('functions for empty elements', function () {
    let ast = parse('<div></div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).toBe(false);
    expect(AstNodeInfo.hasChildren(ast)).toBe(true);
  });

  it('detects text', function () {
    let ast = parse('<div>hello</div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).toBe(true);
  });

  it('detects whitespace', function () {
    let ast = parse('<div> </div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).toBe(true);
  });
});

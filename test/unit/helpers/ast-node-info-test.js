'use strict';

const preprocess = require('./parse');
const AstNodeInfo = require('../../../lib/helpers/ast-node-info');

describe('isImgElement', function() {
  it('can detect an image tag', function() {
    let tableAst = preprocess('<table></table>');
    expect(AstNodeInfo.isImgElement(tableAst.body[0])).toBe(false);

    let imgAst = preprocess('<img />');
    expect(AstNodeInfo.isImgElement(imgAst.body[0])).toBe(true);
  });
});

describe('hasChildren', function() {
  it('functions for empty input', function() {
    expect(AstNodeInfo.hasChildren(preprocess(''))).toBe(false);
  });

  it('functions for empty elements', function() {
    let ast = preprocess('<div></div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).toBe(false);
    expect(AstNodeInfo.hasChildren(ast)).toBe(true);
  });

  it('detects text', function() {
    let ast = preprocess('<div>hello</div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).toBe(true);
  });

  it('detects whitespace', function() {
    let ast = preprocess('<div> </div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).toBe(true);
  });
});

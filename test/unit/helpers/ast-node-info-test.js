'use strict';

const expect = require('chai').expect;
const preprocess = require('@glimmer/syntax').preprocess;
const AstNodeInfo = require('../../../lib/helpers/ast-node-info');

describe('isImgElement', function() {
  it('can detect an image tag', function() {
    let tableAst = preprocess('<table></table>');
    expect(AstNodeInfo.isImgElement(tableAst.body[0])).to.be.false;

    let imgAst = preprocess('<img />');
    expect(AstNodeInfo.isImgElement(imgAst.body[0])).to.be.true;
  });
});

describe('hasChildren', function() {
  it('functions for empty input', function() {
    expect(AstNodeInfo.hasChildren(preprocess(''))).to.be.false;
  });

  it('functions for empty elements', function() {
    let ast = preprocess('<div></div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).to.be.false;
    expect(AstNodeInfo.hasChildren(ast)).to.be.true;
  });

  it('detects text', function() {
    let ast = preprocess('<div>hello</div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).to.be.true;
  });

  it('detects whitespace', function() {
    let ast = preprocess('<div> </div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).to.be.true;
  });
});

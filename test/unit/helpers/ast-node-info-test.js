'use strict';

const expect = require('chai').expect;
const AstNodeInfo = require('../../../lib/helpers/ast-node-info');
const { parse } = require('ember-template-recast');

describe('isImgElement', function() {
  it('can detect an image tag', function() {
    let tableAst = parse('<table></table>');
    expect(AstNodeInfo.isImgElement(tableAst.body[0])).to.be.false;

    let imgAst = parse('<img />');
    expect(AstNodeInfo.isImgElement(imgAst.body[0])).to.be.true;
  });
});

describe('hasChildren', function() {
  it('functions for empty input', function() {
    expect(AstNodeInfo.hasChildren(parse(''))).to.be.false;
  });

  it('functions for empty elements', function() {
    let ast = parse('<div></div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).to.be.false;
    expect(AstNodeInfo.hasChildren(ast)).to.be.true;
  });

  it('detects text', function() {
    let ast = parse('<div>hello</div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).to.be.true;
  });

  it('detects whitespace', function() {
    let ast = parse('<div> </div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).to.be.true;
  });
});

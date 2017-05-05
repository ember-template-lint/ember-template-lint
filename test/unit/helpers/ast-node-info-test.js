var expect = require('chai').expect;
var preprocess = require('glimmer-engine/dist/node_modules/@glimmer/syntax').preprocess;
var AstNodeInfo = require('../../../lib/helpers/ast-node-info');

describe('isImgElement', function() {
  it('can detect an image tag', function() {
    var tableAst = preprocess('<table></table>');
    expect(AstNodeInfo.isImgElement(tableAst.body[0])).to.be.false;

    var imgAst = preprocess('<img />');
    expect(AstNodeInfo.isImgElement(imgAst.body[0])).to.be.true;
  });
});

describe('hasChildren', function() {
  it('functions for empty input', function() {
    expect(AstNodeInfo.hasChildren(preprocess(''))).to.be.false;
  });

  it('functions for empty elements', function() {
    var ast = preprocess('<div></div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).to.be.false;
    expect(AstNodeInfo.hasChildren(ast)).to.be.true;
  });

  it('detects text', function() {
    var ast = preprocess('<div>hello</div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).to.be.true;
  });

  it('detects whitespace', function() {
    var ast = preprocess('<div> </div>');
    expect(AstNodeInfo.hasChildren(ast.body[0])).to.be.true;
  });
});

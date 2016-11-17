var assert = require('power-assert');
var preprocess = require('glimmer-engine/dist/node_modules/glimmer-syntax').preprocess;
var AstNodeInfo = require('../../../lib/helpers/ast-node-info');

describe('isImgElement', function() {
  it('can detect an image tag', function() {
    var tableAst = preprocess('<table></table>');
    assert(AstNodeInfo.isImgElement(tableAst.body[0]) === false);

    var imgAst = preprocess('<img />');
    assert(AstNodeInfo.isImgElement(imgAst.body[0]) === true);
  });
});

describe('hasChildren', function() {
  it('functions for empty input', function() {
    assert(AstNodeInfo.hasChildren(preprocess('')) === false);
  });

  it('functions for empty elements', function() {
    var ast = preprocess('<div></div>');
    assert(AstNodeInfo.hasChildren(ast.body[0]) === false);
    assert(AstNodeInfo.hasChildren(ast) === true);
  });

  it('detects text', function() {
    var ast = preprocess('<div>hello</div>');
    assert(AstNodeInfo.hasChildren(ast.body[0]) === true);
  });

  it('detects whitespace', function() {
    var ast = preprocess('<div> </div>');
    assert(AstNodeInfo.hasChildren(ast.body[0]) === true);
  });
});

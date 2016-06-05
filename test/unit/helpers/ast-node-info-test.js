var assert = require('power-assert');
var parse = require('htmlbars/dist/cjs/htmlbars-syntax').parse;
var AstNodeInfo = require('../../../lib/helpers/ast-node-info');

describe('isImgElement', function() {
  it('can detect an image tag', function() {
    var tableAst = parse('<table></table>');
    assert(AstNodeInfo.isImgElement(tableAst.body[0]) === false);

    var imgAst = parse('<img />');
    assert(AstNodeInfo.isImgElement(imgAst.body[0]) === true);
  });
});

describe('hasChildren', function() {
  it('functions for empty input', function() {
    assert(AstNodeInfo.hasChildren(parse('')) === false);
  });

  it('functions for empty elements', function() {
    var ast = parse('<div></div>');
    assert(AstNodeInfo.hasChildren(ast.body[0]) === false);
    assert(AstNodeInfo.hasChildren(ast) === true);
  });

  it('detects text', function() {
    var ast = parse('<div>hello</div>');
    assert(AstNodeInfo.hasChildren(ast.body[0]) === true);
  });

  it('detects whitespace', function() {
    var ast = parse('<div> </div>');
    assert(AstNodeInfo.hasChildren(ast.body[0]) === true);
  });
});

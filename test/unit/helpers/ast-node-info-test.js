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

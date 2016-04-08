'use strict';

// this Babel plugin removes configuration comments such as:
//   <!-- template-lint triple-curlies=false -->
//   <!-- template-lint enabled=false -->

var AstNodeInfo = require('../../helpers/ast-node-info');

module.exports = function() {
  function RemoveConfigurationHtmlCommentsPlugin() {}

  RemoveConfigurationHtmlCommentsPlugin.prototype.transform = function(ast) {
    var walker = new this.syntax.Walker();
    var bodyEntry;

    walker.visit(ast, function(node) {
      if (node.type === 'Program') {
        for (var i = 0; i < node.body.length; i++) {
          bodyEntry = node.body[i];

          if(AstNodeInfo.isConfigurationHtmlComment(bodyEntry)) {
            // remove the entry
            node.body.splice(i, 1);
          }
        }
      }
    });

    return ast;
  };

  return RemoveConfigurationHtmlCommentsPlugin;
};

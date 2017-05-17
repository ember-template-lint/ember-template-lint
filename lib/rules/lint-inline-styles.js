'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const buildPlugin = require('./base');

/**
 Disallow usage of elements with inline styles

 Good:

 ```
 <div class="class-with-inline-block-rule"></div>
 ```

 Bad:

 ```
 <div style="display:inline-block"></div>
 ```
 */
module.exports = function(addonContext) {
  return class Plugin extends buildPlugin(addonContext, 'img-alt-attributes') {
    visitors() {
      return {
        ElementNode: function(node) {
          let style = AstNodeInfo.findAttribute(node, 'style');
          if (style) {
            this.log({
              message: 'elements cannot have inline styles',
              line: style.loc && style.loc.start.line,
              column: style.loc && style.loc.start.column,
              source: this.sourceForNode(style)
            });
          }
        }
      };
    }
  };
};

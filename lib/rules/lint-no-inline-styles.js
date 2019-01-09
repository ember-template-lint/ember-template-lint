'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

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
module.exports = class InlineStyles extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let style = AstNodeInfo.findAttribute(node, 'style');
        if (style) {
          this.log({
            message: 'elements cannot have inline styles',
            line: style.loc && style.loc.start.line,
            column: style.loc && style.loc.start.column,
            source: this.sourceForNode(style),
          });
        }
      },
    };
  }
};

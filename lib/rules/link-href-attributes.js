'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

/**
 Disallow usage of `<a>` without an `href` attribute.

 Good:

 ```
 <a href="http://localhost">
 ```

 Bad:

 ```
 <a>
 ```
*/
module.exports = class LinkHrefAttributes extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (node.tag === 'a' && !AstNodeInfo.hasAttribute(node, 'href')) {
          this.log({
            message: 'a tags must have an href attribute',
            node,
          });
        }
      },
    };
  }
};

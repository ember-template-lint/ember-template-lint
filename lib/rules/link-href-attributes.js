import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

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
export default class LinkHrefAttributes extends Rule {
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
}

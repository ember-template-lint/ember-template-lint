import { dom } from 'aria-query';

import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const HTML_TAGS = new Set(dom.keys());
const ERROR_MESSAGE = 'The scope attribute should only be set on <th> elements';

export default class NoScopeOutsideTableHeadings extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let hasScope = AstNodeInfo.hasAttribute(node, 'scope');
        if (!hasScope) {
          return;
        }
        // Bypass validation of custom components, since we do not know what HTML tags they have
        if (!HTML_TAGS.has(node.tag)) {
          return;
        }
        if (hasScope && node.tag !== 'th') {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
}

import { dom } from 'aria-query';

import AstNodeInfo from '../helpers/ast-node-info.js';
import isInteractiveElement from '../helpers/is-interactive-element.js';
import Rule from './_base.js';

const HTML_TAGS = new Set(dom.keys());
const ERROR_MESSAGE =
  'A generic element using the aria-activedescendant attribute must have a tabindex';

export default class RequireAriaActivedescendantTabindex extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let hasAriaActivedescendant = AstNodeInfo.hasAttribute(node, 'aria-activedescendant');
        if (!hasAriaActivedescendant) {
          return;
        }
        // Bypass validation of custom components, since we do not know what HTML tags they have
        if (!HTML_TAGS.has(node.tag)) {
          return;
        }
        const tabindex = AstNodeInfo.findAttribute(node, 'tabindex');
        let tabindexValue = Number.naN;
        // Allow for interactive elements that do not specify a tabindex, since they are inherently keyboard-focusable.
        if (!tabindex && isInteractiveElement(node)) {
          return;
        }
        if (tabindex) {
          switch (tabindex.value.type) {
            case 'MustacheStatement': {
              if (tabindex.value.path) {
                if (
                  ['BooleanLiteral', 'NumberLiteral', 'StringLiteral'].includes(
                    tabindex.value.path.type
                  )
                ) {
                  tabindexValue = tabindex.value.path.original;
                }
              }

              break;
            }
            case 'TextNode': {
              tabindexValue = Number.parseInt(tabindex.value.chars, 10);

              break;
            }
            // No default
          }
        }

        if (tabindexValue === Number.naN || tabindexValue < 0) {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
}

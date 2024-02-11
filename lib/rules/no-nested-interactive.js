/*
 Disallows nested of interactive elements

 ```
 {{!-- good  --}}
 <button>Click here</button> <a href="/">and a link</a>

 {{!-- bad --}}
 <button>Click here <a href="/">and a link</a></button>
 ```

 The following values are valid configuration:

   * boolean -- `true` for enabled / `false` for disabled
 */

import ast from '../helpers/ast-node-info.js';
import isInteractiveElement, { reason } from '../helpers/is-interactive-element.js';
import parseConfig from '../helpers/parse-interactive-element-config.js';
import Rule from './_base.js';

export default class NoNestedInteractive extends Rule {
  parseConfig(config) {
    return parseConfig(this.ruleName, config);
  }

  visitor() {
    this._parentInteractiveNode = null;

    let visitor = {
      enter(node) {
        let isInteractive = isInteractiveElement(node);

        if (this.isCustomInteractiveElement(node)) {
          isInteractive = true;
        }

        if (!isInteractive) {
          return;
        }
        if (this.isInteractiveExcluded(node)) {
          return;
        }

        if (this.hasLabelParentNode()) {
          if (this._seenInteractiveChild) {
            this.log({
              message: 'Do not use multiple interactive elements inside a single `<label>`',
              node,
              source: this.sourceForNode(this._parentInteractiveNode),
            });
          } else {
            this._seenInteractiveChild = true;
          }
        } else if (this.hasParentNode()) {
          if (this.hasMenuItemParentNode() && this.isMenuItemNode(node)) {
            // nested menuitem nodes are valid to create a menu/sub-menu pattern
          } else {
            this.log({
              message: this.getLogMessage(node, this._parentInteractiveNode),
              node,
            });
          }
        } else if (this.isInteractiveFromTabindex(node)) {
          // do not consider a thing a "parent interactive node" for
          // tabindex alone
        } else {
          this._parentInteractiveNode = node;
        }
      },

      exit(node) {
        if (this._parentInteractiveNode === node) {
          this._parentInteractiveNode = null;
          this._seenInteractiveChild = false;
        }
      },
    };

    return {
      ElementNode: visitor,
      ComponentNode: visitor,
    };
  }

  hasLabelParentNode() {
    return this._parentInteractiveNode && this._parentInteractiveNode.tag === 'label';
  }

  hasMenuItemParentNode() {
    return this._parentInteractiveNode && this.isMenuItemNode(this._parentInteractiveNode);
  }

  hasParentNode() {
    return this._parentInteractiveNode;
  }

  isCustomInteractiveElement(node) {
    let additionalInteractiveTags = this.config.additionalInteractiveTags || [];

    if (additionalInteractiveTags.includes(node.tag)) {
      return true;
    } else {
      return false;
    }
  }

  isInteractiveFromTabindex(node) {
    let actualReason = reason(node);

    if (actualReason && actualReason.includes('tabindex')) {
      return true;
    } else {
      return false;
    }
  }

  isInteractiveExcluded(node) {
    let actualReason = reason(node);
    let ignoredTags = this.config.ignoredTags || [];
    let ignoreTabindex = this.config.ignoreTabindex;
    let ignoreUsemapAttribute = this.config.ignoreUsemapAttribute;

    if (ignoredTags.includes(node.tag)) {
      return true;
    }

    if (ignoreTabindex && actualReason.includes('tabindex')) {
      return true;
    }

    if (ignoreUsemapAttribute && actualReason.includes('usemap')) {
      return true;
    }
  }

  isMenuItemNode(node) {
    let role = ast.findAttribute(node, 'role');

    return role && role.value && role.value.chars === 'menuitem';
  }

  getLogMessage(node, parentNode) {
    let parentReason = reason(parentNode);
    let childReason = reason(node);

    // `reason` for `additionalInteractiveTags` would be `null`
    // so we need to handle that and update the reason correctly
    if (this.isCustomInteractiveElement(parentNode)) {
      parentReason = `<${parentNode.tag}>`;
    }

    if (this.isCustomInteractiveElement(node)) {
      childReason = `<${node.tag}>`;
    }

    return `Do not use ${childReason} inside ${parentReason}`;
  }
}

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
  constructor(options) {
    super(options);
    this.blocks = [
      {
        _seenInteractiveChild: false,
      },
    ];
  }
  parseConfig(config) {
    return parseConfig(this.ruleName, config);
  }

  get _seenInteractiveChild() {
    return this.blocks.some((block) => block._seenInteractiveChild);
  }
  set _seenInteractiveChild(value) {
    this.blocks.at(-1)._seenInteractiveChild = value;
  }
  /**
   * @returns {import('./types.js').VisitorReturnType<NoNestedInteractive>}
   */
  visitor() {
    this._parentInteractiveNode = null;

    return {
      ElementNode: {
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
              if (
                this.hasDetailsParentNode() &&
                node.tag === 'summary' &&
                this._parentInteractiveNode.children
                  .filter((el) => {
                    if (el.type === 'TextNode') {
                      return el.chars.trim().length !== 0;
                    } else {
                      return true;
                    }
                  })
                  .indexOf(node) === 0
              ) {
                // do nothing if summary is first node of details
              } else {
                this.log({
                  message: this.getLogMessage(node, this._parentInteractiveNode),
                  node,
                });
              }
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
      },
      Block: {
        enter() {
          this.blocks.push({
            _seenInteractiveChild: this._seenInteractiveChild,
          });
        },
        exit() {
          this.blocks.pop();
        },
      },
    };
  }

  hasLabelParentNode() {
    return this._parentInteractiveNode && this._parentInteractiveNode.tag === 'label';
  }

  hasDetailsParentNode() {
    return this._parentInteractiveNode && this._parentInteractiveNode.tag === 'details';
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

    if (this.hasDetailsParentNode()) {
      if (node.tag === 'summary') {
        parentReason = '<details> if it is not first child of <details>';
      }
    }

    return `Do not use ${childReason} inside ${parentReason}`;
  }
}

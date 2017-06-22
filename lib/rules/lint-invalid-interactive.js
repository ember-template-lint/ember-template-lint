'use strict';

const Rule = require('./base');
const isInteractiveElement = require('../helpers/is-interactive-element');
const parseConfig = require('../helpers/parse-interactive-element-config');

module.exports = class InvalidInteractive extends Rule {
  parseConfig(config) {
    return parseConfig(this.ruleName, config);
  }

  isCustomInteractiveElement(node) {
    let additionalInteractiveTags = this.config.additionalInteractiveTags || [];

    if (additionalInteractiveTags.indexOf(node.tag) > -1) {
      return true;
    } else {
      return false;
    }
  }

  visitors() {
    this._element = null;

    let visitor = {
      enter(node) {
        let isInteractive = isInteractiveElement(node) || this.isCustomInteractiveElement(node);
        this._element = !isInteractive ? node : null;
      },

      exit(node) {
        if (this._element === node) {
          this._element = null;
        }
      }
    };

    return {
      ElementModifierStatement(node) {
        if (!this._element) { return; }

        let modifierName = node.path.original;

        if (modifierName === 'action') {
          // Allow {{action "foo" on="submit"}} on form tags
          if (this._element.tag === 'form' && isSubmitAction(node)) {
            return;
          }

          this.log({
            message: 'Interaction added to non-interactive element',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(this._element)
          });
        }
      },

      AttrNode(node) {
        if (!this._element) { return; }

        if (node.value.type !== 'MustacheStatement') {
          return;
        }

        let helperName = node.value.path.original;

        if (helperName === 'action') {
          this.log({
            message: 'Interaction added to non-interactive element',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(this._element)
          });
        }
      },

      ElementNode: visitor,
      ComponentNode: visitor
    };
  }
};

function isSubmitAction(node) {
  let hashPairs = node.hash.pairs || [];
  let i;
  let l = hashPairs.length;
  let hashItem;

  for (i = 0; i < l; i++) {
    hashItem = hashPairs[i];
    if (hashItem.key === 'on' && hashItem.value.value === 'submit') {
      return true;
    }
  }

  return false;
}

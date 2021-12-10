'use strict';

const Rule = require('./_base');

const VALID_ARIA_ATTRIBUTES = new Set([
  'aria-activedescendant',
  'aria-atomic',
  'aria-autocomplete',
  'aria-busy',
  'aria-checked',
  'aria-colcount',
  'aria-colindex',
  'aria-colspan',
  'aria-controls',
  'aria-current',
  'aria-describedby',
  'aria-details',
  'aria-disabled',
  'aria-dragged',
  'aria-dropeffect',
  'aria-errormessage',
  'aria-expanded',
  'aria-flowto',
  'aria-haspopup',
  'aria-hidden',
  'aria-invalid',
  'aria-label',
  'aria-labelledby',
  'aria-level',
  'aria-live',
  'aria-modal',
  'aria-multiline',
  'aria-multiselectable',
  'aria-orientation',
  'aria-owns',
  'aria-placeholder',
  'aria-posinset',
  'aria-pressed',
  'aria-readonly',
  'aria-relevant',
  'aria-required',
  'aria-rowcount',
  'aria-rowindex',
  'aria-rowspan',
  'aria-selected',
  'aria-setsize',
  'aria-sort',
  'aria-valuemax',
  'aria-valuemin',
  'aria-valuenow',
  'aria-valuetext',
]);

function getAriaAttributes(node) {
  let attributes = node.attributes;
  let ariaAttributes = [];
  for (let attribute of attributes) {
    if (attribute.name.startsWith('aria-')) {
      ariaAttributes.push(attribute);
    }
  }
  return ariaAttributes;
}

module.exports = class NoInvalidAriaAttributes extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      node,
    });
  }
  visitor() {
    return {
      ElementNode(node) {
        const ariaAttributes = getAriaAttributes(node);
        if (ariaAttributes.length > 0) {
          for (let attribute of ariaAttributes) {
            if (!VALID_ARIA_ATTRIBUTES.has(attribute.name)) {
              this.logNode({
                message: `${attribute.name} is not a valid ARIA attribute.`,
                node,
              });
            }
          }
        }
      },
    };
  }
};

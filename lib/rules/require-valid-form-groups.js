'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

const ERROR_MESSAGE =
  'Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels';

const FORM_ELEMENTS = new Set(['label', 'input']);

module.exports = class RequireValidFormGroups extends Rule {
  visitor() {
    return {
      ElementNode(node, path) {
        if (FORM_ELEMENTS.has(node.tag)) {
          let parents = [...path.parents()];

          const isValidFormGroup = parents
            .filter((p) => AstNodeInfo.isElementNode(p.node))
            .some((p) => {
              const hasRoleGroup = AstNodeInfo.hasAttributeValue(p.node, 'role', 'group');
              const hasAriaLabel = AstNodeInfo.hasAttribute(p.node, 'aria-labelledby');

              const isLegendorFieldset = ['legend', 'fieldset'].includes(p.node.tag);

              return (hasRoleGroup && hasAriaLabel) || isLegendorFieldset;
            });

          if (!isValidFormGroup) {
            this.log({
              message: ERROR_MESSAGE,
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

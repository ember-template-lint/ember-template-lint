import Rule from './_base.js';

const ERROR_MESSAGE =
  'Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels';

const FORM_ELEMENTS = new Set(['label', 'input']);

export default class RequireValidFormGroups extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<RequireValidFormGroups>}
   */
  visitor() {
    return {
      ElementNode(node, path) {
        if (FORM_ELEMENTS.has(node.tag)) {
          let parents = [...path.parents()];
          const isValidFormGroup = parents
            .filter((p) => p.node.type === 'ElementNode')
            .some((p) => {
              /**
               * @type {import('ember-template-recast').AST.ElementNode}
               */
              let node = p.node;
              const hasRoleGroup = node.attributes.find(
                (attr) =>
                  attr.name === 'role' &&
                  attr.value.type === 'TextNode' &&
                  attr.value.chars === 'group'
              );
              const hasAriaLabel = node.attributes.find((attr) => attr.name === 'aria-labelledby');

              const isLegendorFieldset = ['legend', 'fieldset'].includes(node.tag);

              return (hasRoleGroup && hasAriaLabel) || isLegendorFieldset;
            });

          if (!isValidFormGroup) {
            this.log({
              message: ERROR_MESSAGE,
              node,
            });
          }
        }
      },
    };
  }
}

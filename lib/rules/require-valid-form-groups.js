import Rule from './_base.js';

const ERROR_MESSAGE =
  'Grouped form controls should have appropriate semantics such as fieldset and legend or WAI-ARIA labels';

const FORM_ELEMENTS = new Set(['input']);

export default class RequireValidFormGroups extends Rule {
  /**
   * @param {import('ember-template-recast').AST.ElementNode} node
   */
  hasRoleGroup(node) {
    return node.attributes.find(
      (attr) =>
        attr.name === 'role' && attr.value.type === 'TextNode' && attr.value.chars === 'group'
    );
  }
  /**
   * @param {import('ember-template-recast').AST.ElementNode} node
   */
  hasAriaLabel(node) {
    return node.attributes.find((attr) => attr.name === 'aria-labelledby');
  }
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
              const hasRoleGroup = this.hasRoleGroup(node);
              const hasAriaLabel = this.hasAriaLabel(node);

              const isLegendorFieldset = ['legend', 'fieldset'].includes(node.tag);

              return (hasRoleGroup && hasAriaLabel) || isLegendorFieldset;
            });
          let hasMoreFormElementsInParentScope = false;
          if (path.parent.node.type === 'ElementNode') {
            const elementChildren = path.parent.node.children.filter(
              (el) => el.type === 'ElementNode'
            );
            const formElements = elementChildren.filter((el) => FORM_ELEMENTS.has(el.tag));
            hasMoreFormElementsInParentScope = formElements.length > 1 ? true : false;
          }
          if (!isValidFormGroup && hasMoreFormElementsInParentScope) {
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

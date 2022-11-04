import { roles } from 'aria-query';

import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

function createRequiredAttributeErrorMessage(attrs, role) {
  if (attrs.length < 2) {
    return `The attribute ${attrs[0]} is required by the role ${role}`;
  } else {
    return `The attributes ${attrs.join(', ')} are required by the role ${role}`;
  }
}

export default class requireMandatoryRoleAttributes extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let role;
        if (AstNodeInfo.hasAttribute(node, 'role')) {
          let roleAttrNode = AstNodeInfo.findAttribute(node, 'role');
          if (roleAttrNode.value.type === 'TextNode') {
            role = roleAttrNode.value.chars || undefined;
          }
        }

        // Skip validation if role is unknown
        if (!role) {
          return;
        }
        const roleDefinition = roles.get(role);
        if (roleDefinition === undefined) {
          return;
        }

        // Get a list of the ARIA attributes defined for this element
        let foundAriaAttributes = [];
        for (const attribute of node.attributes) {
          if (attribute.name.startsWith('aria-')) {
            foundAriaAttributes.push(attribute);
          }
        }

        // Check that all required attributes for this role are present
        const requiredAttributes = Object.keys(roleDefinition.requiredProps);
        for (let requiredAttribute of requiredAttributes) {
          let hasRequiredAttribute = foundAriaAttributes.some(
            (attr) => attr.name === requiredAttribute
          );
          if (!hasRequiredAttribute) {
            this.log({
              message: createRequiredAttributeErrorMessage(requiredAttributes, role),
              node,
            });
          }
        }
      },
      MustacheStatement(node) {
        const roleAttribute = node.hash.pairs.find((pair) => pair.key === 'role');
        if (!roleAttribute) {
          return;
        }
        if (!roleAttribute.value.type === 'StringLiteral') {
          return;
        }
        let role = roleAttribute.value.original;

        // Skip validation if role is unknown
        if (!role) {
          return;
        }
        const roleDefinition = roles.get(role);
        if (!roleDefinition) {
          return;
        }

        // Get a list of the ARIA attributes defined for this element
        let foundAriaAttributes = [];
        for (const pair of node.hash.pairs) {
          if (pair.key.startsWith('aria-')) {
            foundAriaAttributes.push(pair);
          }
        }

        // Check that all required attributes for this role are present
        const requiredAttributes = Object.keys(roleDefinition.requiredProps);
        for (let requiredAttribute of requiredAttributes) {
          let hasRequiredAttribute = foundAriaAttributes.some(
            (attr) => attr.key === requiredAttribute
          );
          if (!hasRequiredAttribute) {
            this.log({
              message: createRequiredAttributeErrorMessage(requiredAttributes, role),
              node,
            });
          }
        }
      },
    };
  }
}

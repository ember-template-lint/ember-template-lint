import { roles, elementRoles } from 'aria-query';

import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

function createUnsupportedAttributeErrorMessage(attr, role, element) {
  if (element) {
    return `The attribute ${attr} is not supported by the element ${element} with the implicit role of ${role}`;
  } else {
    return `The attribute ${attr} is not supported by the role ${role}`;
  }
}
function getImplicitRole(element, typeAttribute) {
  if (element === 'input') {
    for (let key of elementRoles.keys()) {
      if (key.name === element && key.attributes) {
        let attributes = key.attributes;
        for (let attribute of attributes) {
          if (attribute.name === 'type' && attribute.value === typeAttribute) {
            return elementRoles.get(key)[0];
          }
        }
      }
    }
  }
  const key = elementRoles.keys().find((key) => key.name === element);
  const implicitRoles = key && elementRoles.get(key);
  return implicitRoles && implicitRoles[0];
}

export default class NoUnsupportedRoleAttributes extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let element, typeAttribute, role;
        // Check if role is explicitly defined
        if (AstNodeInfo.hasAttribute(node, 'role')) {
          let roleAttrNode = AstNodeInfo.findAttribute(node, 'role');
          if (roleAttrNode.value.type === 'TextNode') {
            role = roleAttrNode.value.chars || undefined;
          }
        }
        // Otherwise try and get implicit role
        else {
          element = node.tag;
          if (AstNodeInfo.hasAttribute(node, 'type')) {
            let typeAttrNode = AstNodeInfo.findAttribute(node, 'type');
            if (typeAttrNode.value.type === 'TextNode') {
              typeAttribute = typeAttrNode.value.chars || '';
            }
          }
          role = getImplicitRole(element, typeAttribute);
        }

        // Skip validation for elements with unknown ARIA roles
        if (!role) {
          return;
        }
        const roleDefinition = roles.get(role);
        if (!roleDefinition) {
          return;
        }

        // Get a list of the ARIA attributes defined for this element
        let foundAriaAttributes = [];
        for (const attribute of node.attributes) {
          if (attribute.name.startsWith('aria-')) {
            foundAriaAttributes.push(attribute);
          }
        }

        // Check that each ARIA attribute found is within the supported property set for its role
        const supportedProps = Object.keys(roleDefinition.props);
        for (let attribute of foundAriaAttributes) {
          if (!supportedProps.includes(attribute.name)) {
            if (this.mode === 'fix') {
              node.attributes = node.attributes.filter((attrNode) => attrNode !== attribute);
            } else {
              this.log({
                message: createUnsupportedAttributeErrorMessage(attribute.name, role, element),
                node,
                isFixable: true,
              });
            }
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

        // Skip validation for elements with unknown ARIA roles
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

        // Check that each ARIA attribute found is within the supported property set for its role
        const supportedProps = Object.keys(roleDefinition.props);
        for (let attribute of foundAriaAttributes) {
          if (!supportedProps.includes(attribute.key)) {
            if (this.mode === 'fix') {
              node.hash.pairs = node.hash.pairs.filter((pair) => pair !== attribute);
            } else {
              this.log({
                message: createUnsupportedAttributeErrorMessage(attribute.key, role, undefined),
                node,
                isFixable: true,
              });
            }
          }
        }
      },
    };
  }
}

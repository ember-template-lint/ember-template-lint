import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

// From https://www.w3.org/TR/wai-aria-1.0/roles#abstract_roles
const PROHIBITED_ROLE_VALUES = new Set([
  'command',
  'composite',
  'input',
  'landmark',
  'range',
  'roletype',
  'section',
  'sectionhead',
  'select',
  'structure',
  'widget',
  'window',
]);
export default class NoAbstractRoles extends Rule {
  logNode({ node, message }) {
    return this.log({
      message,
      node,
    });
  }
  visitor() {
    return {
      ElementNode(node) {
        const roleAttr = AstNodeInfo.findAttribute(node, 'role');
        if (roleAttr) {
          const roleAttrValue = AstNodeInfo.attributeTextValue(roleAttr);
          if (PROHIBITED_ROLE_VALUES.has(roleAttrValue)) {
            this.logNode({
              message: `${roleAttrValue} is an abstract role, and is not a valid value for the role attribute.`,
              node,
            });
          }
        }
      },
    };
  }
}

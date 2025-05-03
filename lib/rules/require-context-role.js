import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const ROOTS = {
  row: ['rowheader', 'columnheader', 'cell', 'gridcell'],
  group: ['listitem', 'menuitem', 'menuitemradio', 'treeitem'],
  menu: ['menuitem', 'menuitemcheckbox', 'menuitemradio'],
  menubar: ['menuitem', 'menuitemcheckbox', 'menuitemradio'],
  list: ['listitem'],
  listbox: ['option'],
  grid: ['row', 'rowheader', 'rowgroup'],
  rowgroup: ['row'],
  treegrid: ['row', 'rowgroup'],
  tablist: ['tab'],
  table: ['row', 'rowgroup'],
  tree: ['treeitem'],
};

const CHILDREN_FOR_ANALYZE = new Set(
  Object.keys(ROOTS).reduce((acc, keyName) => [...acc, ...ROOTS[keyName]], [])
);

const VALID_PARENTS_FOR_CHILD = Object.keys(ROOTS).reduce((result, keyName) => {
  const children = ROOTS[keyName];
  for (const childName of children) {
    if (!(childName in result)) {
      result[childName] = [];
    }
    result[childName].push(keyName);
  }
  return result;
}, {});
for (const key of Object.keys(VALID_PARENTS_FOR_CHILD)) {
  VALID_PARENTS_FOR_CHILD[key].sort();
}

function errorMessage(role) {
  const roles = VALID_PARENTS_FOR_CHILD[role] || [];
  return `You have an element with the role of "${role}" but it is missing the required (immediate) parent element of "[${roles.join(
    ', '
  )}]". Reference: https://www.w3.org/TR/wai-aria-1.1/#${role}.`;
}

function roleName(roleNode) {
  return roleNode && roleNode.value.type === 'TextNode' ? roleNode.value.chars : '';
}
export default class RequireContextRole extends Rule {
  visitor() {
    return {
      ElementNode(node, path) {
        const ariaHidden = AstNodeInfo.hasAttribute(node, 'aria-hidden');

        if (ariaHidden) {
          return;
        }

        const role = AstNodeInfo.findAttribute(node, 'role');

        if (!role) {
          return;
        }

        const roleValue = roleName(role);

        if (!roleValue) {
          return;
        }

        if (!CHILDREN_FOR_ANALYZE.has(roleValue)) {
          return;
        }

        let parentPath = path;
        let parentElementIndex = 0;
        while (parentPath && parentPath.parent && parentElementIndex === 0) {
          parentPath = parentPath.parent;
          let parentNode = parentPath.node;
          if (parentNode && parentNode.type === 'ElementNode') {
            if (AstNodeInfo.hasAttribute(parentNode, 'aria-hidden')) {
              return;
            }
            const parentRole = AstNodeInfo.findAttribute(parentNode, 'role');
            const parentRoleValue = parentRole ? roleName(parentRole) : '';
            if (parentRoleValue === 'presentation' || parentRoleValue === 'none') {
              continue;
            }
            parentElementIndex++;
            if (!VALID_PARENTS_FOR_CHILD[roleValue].includes(parentRoleValue)) {
              this.log({
                message: errorMessage(roleValue),
                line: role.loc && role.loc.start.line,
                column: role.loc && role.loc.start.column,
                source: this.sourceForNode(role),
                node: role,
              });
            }
          }
        }
      },
    };
  }
}

'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');
const iterateParents = require('../helpers/iterate-parents');

const ROOTS = {
  row: ['rowheader', 'columnheader', 'gridcell'],
  group: ['listitem', 'menuitem', 'menuitemradio', 'treeitem'],
  menu: ['menuitem', 'menuitemcheckbox', 'menuitemradio'],
  menubar: ['menuitem', 'menuitemcheckbox', 'menuitemradio'],
  list: ['listitem'],
  listbox: ['option'],
  grid: ['row', 'rowgroup'],
  rowgroup: ['row'],
  treegrid: ['row'],
  tablist: ['tab'],
  tree: ['treeitem'],
};

const CHILDREN_FOR_ANALYZE = new Set(
  Object.keys(ROOTS).reduce((acc, keyName) => acc.concat(ROOTS[keyName]), [])
);
const VALID_PARENTS_FOR_CHILD = Object.keys(ROOTS).reduce((result, keyName) => {
  const children = ROOTS[keyName];
  children.forEach((childName) => {
    if (!(childName in result)) {
      result[childName] = [];
    }
    result[childName].push(keyName);
  });
  return result;
}, {});
Object.keys(VALID_PARENTS_FOR_CHILD).forEach((key) => {
  VALID_PARENTS_FOR_CHILD[key].sort();
});

function errorMessage(role) {
  const roles = VALID_PARENTS_FOR_CHILD[role] || [];
  return `You have an element with the role of "${role}" but it is missing the required (immediate) parent element of "[${roles.join(
    ', '
  )}]". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#${role}.`;
}

function roleName(roleNode) {
  return roleNode && roleNode.value.type === 'TextNode' ? roleNode.value.chars : '';
}
module.exports = class RequireContextRole extends Rule {
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

        for (let parentPath of iterateParents(path)) {
          let parentNode = parentPath.node;
          if (parentNode && parentNode.type === 'ElementNode') {
            const parentRole = AstNodeInfo.findAttribute(parentNode, 'role');
            const parentRoleValue = roleName(parentRole);
            if (!VALID_PARENTS_FOR_CHILD[roleValue].includes(parentRoleValue)) {
              this.log({
                message: errorMessage(roleValue),
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node),
              });
            }
          }
        }
      },
    };
  }
};

module.exports.errorMessage = errorMessage;

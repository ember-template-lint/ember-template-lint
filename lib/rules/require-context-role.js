'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

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

const CHILDS_FOR_ANALYZE = new Set(Object.keys(ROOTS).flatMap((keyName) => ROOTS[keyName]));
const VALID_PARENTS_FOR_CHILD = Object.keys(ROOTS).reduce((result, keyName) => {
  const childs = ROOTS[keyName];
  childs.forEach((childName) => {
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
const CHILD_PROP_KEY = '_PRIVATE_REQUIRED_CONTEXT_KEY_';

function errorMessage(role) {
  const roles = VALID_PARENTS_FOR_CHILD[role] || [];
  return `You have an element with the role of "${role}" but it is missing the required (immediate) parent element of "[${roles.join(
    ', '
  )}]". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#${role}.`;
}

module.exports = class RequireContextRole extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const ariaHidden = AstNodeInfo.hasAttribute(node, 'aria-hidden');
        if (ariaHidden) {
          return;
        }
        if (CHILD_PROP_KEY in node) {
          const opts = node[CHILD_PROP_KEY];
          if (!opts.logged) {
            opts.logged = true;
            this.log({
              message: errorMessage(opts.value),
              line: node.loc && node.loc.start.line,
              column: node.loc && node.loc.start.column,
              source: this.sourceForNode(node),
            });
          }
        }

        if (!node.children.length) {
          return;
        }

        const role = AstNodeInfo.findAttribute(node, 'role');
        const roleValue = role && role.value.type === 'TextNode' ? role.value.chars : '';
        const childs = node.children
          .map((child) => {
            const isElement = child.type === 'ElementNode';
            if (!isElement) {
              return false;
            }
            const childRole = AstNodeInfo.findAttribute(child, 'role');
            if (!childRole || childRole.value.type !== 'TextNode') {
              return false;
            }
            const childRoleValue = childRole.value.chars;
            if (!CHILDS_FOR_ANALYZE.has(childRoleValue)) {
              return false;
            }
            return {
              value: childRoleValue,
              node: child,
            };
          })
          .filter((item) => item !== false);

        // VALID_PARENTS_FOR_CHILD
        childs.forEach((child) => {
          if (!VALID_PARENTS_FOR_CHILD[child.value].includes(roleValue)) {
            if (!child.node[CHILD_PROP_KEY]) {
              child.node[CHILD_PROP_KEY] = {
                value: child.value,
                logged: false,
              };
            }
          }
        });
      },
    };
  }
};

module.exports.errorMessage = errorMessage;

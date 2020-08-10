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

const CHILDREN_FOR_ANALYZE = new Set(Object.keys(ROOTS).flatMap((keyName) => ROOTS[keyName]));
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

const metaForNode = new WeakMap();

module.exports = class RequireContextRole extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const ariaHidden = AstNodeInfo.hasAttribute(node, 'aria-hidden');
        if (ariaHidden) {
          return;
        }
        if (metaForNode.has(node)) {
          const opts = metaForNode.get(node);
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
        const children = node.children
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
            if (!CHILDREN_FOR_ANALYZE.has(childRoleValue)) {
              return false;
            }
            return {
              value: childRoleValue,
              node: child,
            };
          })
          .filter((item) => item !== false);

        // VALID_PARENTS_FOR_CHILD
        children.forEach((child) => {
          if (!VALID_PARENTS_FOR_CHILD[child.value].includes(roleValue)) {
            if (!metaForNode.has(child.node)) {
              metaForNode.set(child.node, {
                value: child.value,
                logged: false,
              });
            }
          }
        });
      },
    };
  }
};

module.exports.errorMessage = errorMessage;

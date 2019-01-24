'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

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

const VALID_PARENTS_FOR_CHILD = Object.keys(ROOTS).reduce((result, keyName) => {
  const childs = ROOTS[keyName];
  childs.forEach(childName => {
    if (!(childName in result)) {
      result[childName] = [];
    }
    result[childName].push(keyName);
  });
  return result;
}, {});
Object.keys(VALID_PARENTS_FOR_CHILD).forEach(key => {
  VALID_PARENTS_FOR_CHILD[key].sort();
});
const errorMessage = role => {
  return `You have an element with the role of "${role}" but it is missing the required (immediate) parent element of "[${VALID_PARENTS_FOR_CHILD[
    role
  ].join(', ')}]". Reference: https://www.w3.org/TR/wai-aria-1.0/roles#${role}.`;
};

generateRuleTests({
  name: 'required-context-role',

  config: true,

  good: [
    '<div role="list"><div role="listitem">Item One</div><div role="listitem">Item Two</div></div>',
  ],

  bad: [
    {
      template: '<div><div role="columnheader">Item One</div></div>',
      result: {
        message: errorMessage('columnheader'),
        moduleId: 'layout.hbs',
        source: '<div role="columnheader">Item One</div>',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div><div role="gridcell">Item One</div></div>',
      result: {
        message: errorMessage('gridcell'),
        moduleId: 'layout.hbs',
        source: '<div role="gridcell">Item One</div>',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div><div role="listitem">Item One</div></div>',
      result: {
        message: errorMessage('listitem'),
        moduleId: 'layout.hbs',
        source: '<div role="listitem">Item One</div>',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div><div role="menuitem">Item One</div></div>',
      result: {
        message: errorMessage('menuitem'),
        moduleId: 'layout.hbs',
        source: '<div role="menuitem">Item One</div>',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div><div role="menuitemcheckbox">Item One</div></div>',
      result: {
        message: errorMessage('menuitemcheckbox'),
        moduleId: 'layout.hbs',
        source: '<div role="menuitemcheckbox">Item One</div>',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div><div role="menuitemradio">Item One</div></div>',
      result: {
        message: errorMessage('menuitemradio'),
        moduleId: 'layout.hbs',
        source: '<div role="menuitemradio">Item One</div>',
        line: 1,
        column: 5,
      },
    },

    {
      template: '<div><div role="option">Item One</div></div>',
      result: {
        message: errorMessage('option'),
        moduleId: 'layout.hbs',
        source: '<div role="option">Item One</div>',
        line: 1,
        column: 5,
      },
    },

    {
      template: '<div><div role="row">Item One</div></div>',
      result: {
        message: errorMessage('row'),
        moduleId: 'layout.hbs',
        source: '<div role="row">Item One</div>',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div><div role="rowgroup">Item One</div></div>',
      result: {
        message: errorMessage('rowgroup'),
        moduleId: 'layout.hbs',
        source: '<div role="rowgroup">Item One</div>',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div><div role="rowheader">Item One</div></div>',
      result: {
        message: errorMessage('rowheader'),
        moduleId: 'layout.hbs',
        source: '<div role="rowheader">Item One</div>',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div><div role="tab">Item One</div></div>',
      result: {
        message: errorMessage('tab'),
        moduleId: 'layout.hbs',
        source: '<div role="tab">Item One</div>',
        line: 1,
        column: 5,
      },
    },
    {
      template: '<div><div role="treeitem">Item One</div></div>',
      result: {
        message: errorMessage('treeitem'),
        moduleId: 'layout.hbs',
        source: '<div role="treeitem">Item One</div>',
        line: 1,
        column: 5,
      },
    },
  ],
});

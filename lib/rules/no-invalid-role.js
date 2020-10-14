'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./base');

function createErrorMessageDisallowedRoleForElement(element) {
  return `Use of presentation role on <${element}> detected. Semantic elements should not be used for presentation.`;
}

function createNonexistentRoleErrorMessage(element) {
  return `Use of invalid role on <${element}> detected. Please refer here: https://www.w3.org/WAI/PF/aria/roles#widget_roles for valid list of roles that can be assigned.`;
}

// None of these elements can be marked with `role="presentation"` or `role="none"`.
// List from https://developer.mozilla.org/en-US/docs/Web/HTML/Element.
const ELEMENTS_DISALLOWING_PRESENTATION_OR_NONE_ROLE = new Set([
  'a',
  'abbr',
  'applet',
  'area',
  'audio',
  'b',
  'bdi',
  'bdo',
  'blockquote',
  'br',
  'button',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'dir',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'form',
  'hr',
  'i',
  'iframe',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meter',
  'noembed',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'pre',
  'progress',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'select',
  'small',
  'source',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'track',
  'tt',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
]);

// List of roles taken from https://www.w3.org/WAI/PF/aria/roles#widget_roles
// The following is a collated list of Widget, Document Structure and Landmark Roles
const VALID_ROLES = new Set([
  'alert',
  'application',
  'article',
  'combobox',
  'alertdialog',
  'banner',
  'button',
  'checkbox',
  'columnheader',
  'complementary',
  'contentinfo',
  'definition',
  'dialog',
  'directory',
  'document',
  'form',
  'grid',
  'gridcell',
  'group',
  'heading',
  'img',
  'link',
  'list',
  'listbox',
  'listitem',
  'log',
  'main',
  'marquee',
  'math',
  'menu',
  'menubar',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'navigation',
  'none',
  'note',
  'option',
  'presentation',
  'progressbar',
  'radio',
  'radiogroup',
  'region',
  'row',
  'rowgroup',
  'rowheader',
  'scrollbar',
  'search',
  'separator',
  'slider',
  'spinbutton',
  'status',
  'tab',
  'tablist',
  'tabpanel',
  'textbox',
  'timer',
  'toolbar',
  'tooltip',
  'tree',
  'treegrid',
  'treeitem',
]);

const DEFAULT_CONFIG = { catchNonexistentRoles: false };

module.exports = class NoInvalidRole extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        return config ? DEFAULT_CONFIG : false;
      case 'object':
        return { catchNonexistentRoles: config.catchNonexistentRoles };
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * object -- An object with the following keys:',
        '    * `catchNonexistentRoles` -- Whether invalid role values should be allowed (defaults to `false`)',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      ElementNode(node) {
        const hasRoleAttribute = AstNodeInfo.hasAttribute(node, 'role');

        if (!hasRoleAttribute) {
          return;
        }

        const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');

        if (
          ['presentation', 'none'].includes(roleValue) &&
          ELEMENTS_DISALLOWING_PRESENTATION_OR_NONE_ROLE.has(node.tag)
        ) {
          this.log({
            message: createErrorMessageDisallowedRoleForElement(node.tag),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }

        if (this.config.catchNonexistentRoles && !VALID_ROLES.has(roleValue.toLowerCase())) {
          this.log({
            message: createNonexistentRoleErrorMessage(node.tag),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.createErrorMessageDisallowedRoleForElement = createErrorMessageDisallowedRoleForElement;
module.exports.createNonexistentRoleErrorMessage = createNonexistentRoleErrorMessage;

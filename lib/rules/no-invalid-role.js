import AstNodeInfo from '../helpers/ast-node-info.js';
import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

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
const WIDGET_ROLES = new Set([
  'button',
  'checkbox',
  'gridcell',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'progressbar',
  'radio',
  'scrollbar',
  'searchbox',
  'separator', // When focusable
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'tabpanel',
  'textbox',
  'treeitem',
]);

const COMPOSITE_WIDGET_ROLES = new Set([
  'combobox',
  'grid',
  'listbox',
  'menu',
  'menubar',
  'radiogroup',
  'tablist',
  'tree',
  'treegrid',
]);

// https://www.w3.org/TR/wai-aria/#document_structure_roles
const DOCUMENT_STRUCTURE_ROLES = new Set([
  'application',
  'article',
  'associationlist',
  'associationlistitemkey',
  'associationlistitemvalue',
  'blockquote',
  'caption',
  'cell',
  'code',
  'columnheader',
  'comment',
  'definition',
  'deletion',
  'directory',
  'document',
  'emphasis',
  'feed',
  'figure',
  'generic',
  'group',
  'heading',
  'img',
  'insertion',
  'list',
  'listitem',
  'mark',
  'math',
  'meter',
  'none',
  'note',
  'paragraph',
  'presentation',
  'row',
  'rowgroup',
  'rowheader',
  'separator', // When not focusable
  'strong',
  'subscript',
  'suggestion',
  'superscript',
  'table',
  'term',
  'time',
  'toolbar',
  'tooltip',
]);

const LANDMARK_ROLES = new Set([
  'banner',
  'complementary',
  'contentinfo',
  'form',
  'main',
  'navigation',
  'region',
  'search',
]);

const LIVE_REGION_ROLES = new Set(['alert', 'log', 'marquee', 'status', 'timer']);
const WINDOW_ROLES = new Set(['alertdialog', 'dialog']);

const VALID_ROLES = new Set([
  ...WIDGET_ROLES,
  ...COMPOSITE_WIDGET_ROLES,
  ...DOCUMENT_STRUCTURE_ROLES,
  ...LANDMARK_ROLES,
  ...LIVE_REGION_ROLES,
  ...WINDOW_ROLES,
]);

const DEFAULT_CONFIG = { catchNonexistentRoles: true };

export default class NoInvalidRole extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        return config ? DEFAULT_CONFIG : false;
      }
      case 'object': {
        return { catchNonexistentRoles: config.catchNonexistentRoles };
      }
      case 'undefined': {
        return false;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * object -- An object with the following keys:',
        '    * `catchNonexistentRoles` -- Whether invalid role values should be allowed (defaults to `true`)',
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

        const roleAttrNode = AstNodeInfo.findAttribute(node, 'role');
        if (roleAttrNode.value.type !== 'TextNode') {
          return;
        }

        let roleValue = roleAttrNode.value.chars;

        if (
          ['presentation', 'none'].includes(roleValue) &&
          ELEMENTS_DISALLOWING_PRESENTATION_OR_NONE_ROLE.has(node.tag)
        ) {
          this.log({
            message: createErrorMessageDisallowedRoleForElement(node.tag),
            node,
          });
        }

        if (this.config.catchNonexistentRoles && !VALID_ROLES.has(roleValue.toLowerCase())) {
          this.log({
            message: createNonexistentRoleErrorMessage(node.tag),
            node,
          });
        }
      },
    };
  }
}

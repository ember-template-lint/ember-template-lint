'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

function createErrorMessage(element) {
  return `Use of presentation role on <${element}> detected. Semantic elements should not be used for presentation.`;
}

// None of these elements can be marked with `role="presentation"` or `role="none"`.
// List from https://developer.mozilla.org/en-US/docs/Web/HTML/Element.
const DISALLOWED_ELEMENTS = [
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
];

module.exports = class NoInvalidRole extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const hasRoleAttribute = AstNodeInfo.hasAttribute(node, 'role');

        if (!hasRoleAttribute) {
          return;
        }

        const roleValue = AstNodeInfo.elementAttributeValue(node, 'role');

        if (!['presentation', 'none'].includes(roleValue)) {
          return;
        }

        if (DISALLOWED_ELEMENTS.includes(node.tag)) {
          this.log({
            message: createErrorMessage(node.tag),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.createErrorMessage = createErrorMessage;

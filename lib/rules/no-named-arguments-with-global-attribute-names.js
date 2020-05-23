'use strict';

const Rule = require('./base');
const createErrorMessage = require('../helpers/create-error-message');
const isAngleBracketComponent = require('../helpers/is-angle-bracket-component');

const ERROR_MESSAGE = 'Named argument (%) should not use an HTML global attribute name.';

const DEFAULT_CONFIG = {
  allow: [],
  disallow: [],
};

function makeError(name) {
  return ERROR_MESSAGE.replace('%', name);
}

// from the list of global attributes: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
// excluding `aria-*`, `data-*`, and event handler attributes like `onclick` (handled separately)
// also excludes:
//   deprecated attributes: `contextmenu`, `dropzone`
//   experimental attributes: `exportparts`, `translate`
//   nonstandard attributes: `item*` for Microdata feature
const globalAttributeNames = [
  'accesskey',
  'autocapitalize',
  'class',
  'contenteditable',
  'dir',
  'draggable',
  'hidden',
  'id',
  'inputmode',
  'is',
  'lang',
  'part',
  'slot',
  'spellcheck',
  'style',
  'tabindex',
  'title',
];

// from the list of event handler attributes: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
const eventHandlerAttributeNames = [
  'onabort',
  'onautocomplete',
  'onautocompleteerror',
  'onblur',
  'oncancel',
  'oncanplay',
  'oncanplaythrough',
  'onchange',
  'onclick',
  'onclose',
  'oncontextmenu',
  'oncuechange',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragexit',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'ondurationchange',
  'onemptied',
  'onended',
  'onerror',
  'onfocus',
  'oninput',
  'oninvalid',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onload',
  'onloadeddata',
  'onloadedmetadata',
  'onloadstart',
  'onmousedown',
  'onmouseenter',
  'onmouseleave',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onmousewheel',
  'onpause',
  'onplay',
  'onplaying',
  'onprogress',
  'onratechange',
  'onreset',
  'onresize',
  'onscroll',
  'onseeked',
  'onseeking',
  'onselect',
  'onshow',
  'onsort',
  'onstalled',
  'onsubmit',
  'onsuspend',
  'ontimeupdate',
  'ontoggle',
  'onvolumechange',
  'onwaiting',
];

function isNamedArgWithDisallowedName(name, config) {
  const allow = config.allow || [];
  const disallow = config.disallow || [];
  if (!name.startsWith('@')) {
    return false;
  }

  const strippedName = name.slice(1);
  if (allow.includes(strippedName)) {
    return false;
  }

  return (
    strippedName.startsWith('aria-') ||
    strippedName.startsWith('data-') ||
    globalAttributeNames.includes(strippedName) ||
    eventHandlerAttributeNames.includes(strippedName) ||
    disallow.includes(strippedName)
  );
}

module.exports = class NoNamedArgumentsWithGlobalAttributeNames extends Rule {
  parseConfig(config) {
    if (config === true) {
      return DEFAULT_CONFIG;
    }

    if (config && typeof config === 'object') {
      return {
        allow: 'allow' in config ? config.allow : DEFAULT_CONFIG.allow,
        disallow: 'disallow' in config ? config.disallow : DEFAULT_CONFIG.disallow,
      };
    }

    let errorMessage = createErrorMessage(
      'no-named-arguments-with-global-attribute-names',
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * object -- An object with the following keys:',
        '    * `allow` -- array: a list of names that **can** be invoked as named arguments, which overrides both default & configured disallowed names',
        '    * `disallow` -- array: a list of names that **cannot** be invoked as named arguments, in addition to the defaults',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      ElementNode(node) {
        if (isAngleBracketComponent(this.scope, node)) {
          (node.attributes || []).forEach((attribute) => {
            if (isNamedArgWithDisallowedName(attribute.name, this.config)) {
              this.log({
                message: makeError(attribute.name),
                line: node.loc && node.loc.start.line,
                column: node.loc && node.loc.start.column,
                source: this.sourceForNode(node),
              });
            }
          });
        }
      },
    };
  }
};

module.exports.makeError = makeError;

import createErrorMessage from '../helpers/create-error-message.js';
import { match } from '../helpers/node-matcher.js';
import Rule from './_base.js';

const DEFAULT_GLOBAL_ATTRIBUTES = [
  'title',
  'aria-label',
  'aria-placeholder',
  'aria-roledescription',
  'aria-valuetext',
];

const DEFAULT_ELEMENT_ATTRIBUTES = {
  input: ['placeholder'],
  Input: ['placeholder', '@placeholder'],
  Textarea: ['placeholder', '@placeholder'],
  img: ['alt'],
};

const DEFAULT_ALLOWLIST = [
  '&lpar;', // (
  '&rpar;', // )
  '&comma;', // ,
  '&period;', // .
  '&amp;', // &
  '&AMP;', // &
  '&plus;', // +
  '&minus;', // -
  '&equals;', // =
  '&ast;', // *
  '&midast;', // *
  '&sol;', // /
  '&num;', // #
  '&percnt;', // %
  '&excl;', // !
  '&quest;', // ?
  '&colon;', // :
  '&lsqb;', // [
  '&lbrack;', // [
  '&rsqb;', // ]
  '&rbrack;', // ]
  '&lcub;', // {
  '&lbrace;', // {
  '&rcub;', // }
  '&rbrace;', // }
  '&lt;', // <
  '&LT;', // <
  '&gt;', // >
  '&GT;', // >
  '&bull;', // •
  '&bullet;', // •
  '&mdash;', // —
  '&ndash;', // –
  '&nbsp;', // non-breaking space
  '&Tab;',
  '&NewLine;',
  '&verbar;', // |
  '&vert;', // |
  '&VerticalLine;', // |
  '(',
  ')',
  ',',
  '.',
  '&',
  '+',
  '-',
  '=',
  '*',
  '/',
  '#',
  '%',
  '!',
  '?',
  ':',
  '[',
  ']',
  '{',
  '}',
  '<',
  '>',
  '•',
  '—',
  ' ',
  '|',
];

const IGNORED_ELEMENTS = new Set(['pre', 'script', 'style', 'template', 'textarea']);

// Character entity reference chart: https://dev.w3.org/html5/html-author/charref
const DEFAULT_CONFIG = {
  allowlist: DEFAULT_ALLOWLIST,
  globalAttributes: DEFAULT_GLOBAL_ATTRIBUTES,
  elementAttributes: DEFAULT_ELEMENT_ATTRIBUTES,
};

function isPageTitleHelper(node) {
  return match(node.path, { original: 'page-title', type: 'PathExpression' });
}

function isValidConfigObjectFormat(config) {
  for (let key in config) {
    let value = config[key];
    let valueType = typeof value;
    let valueIsArray = Array.isArray(value);

    if (key === 'allowlist' && !valueIsArray) {
      return false;
    } else if (key === 'globalAttributes' && !valueIsArray) {
      return false;
    } else if (key === 'elementAttributes' && valueType === 'object') {
      if (valueIsArray) {
        return false;
      }
    } else if (!DEFAULT_CONFIG[key]) {
      return false;
    }
  }

  return true;
}

function sanitizeConfigArray(allowlist = []) {
  return allowlist.filter((option) => option !== '').sort((a, b) => b.length - a.length);
}

/**
 * Example:
 * obj1 = { img: ['data-alt'] } }
 * obj2 = { img: ['alt'] } }
 * result = { img: ['data-alt', 'alt'] } }
 */
function mergeObjects(obj1 = {}, obj2 = {}) {
  const result = {};
  for (const [key, value] of Object.entries(obj1)) {
    result[key] = [...(result[key] || []), ...value];
  }
  for (const [key, value] of Object.entries(obj2)) {
    result[key] = [...(result[key] || []), ...value];
  }
  return result;
}

export default class NoBareStrings extends Rule {
  constructor(options) {
    super(options);
    this._elementStack = [];
  }

  isWithinIgnoredElement() {
    return this._elementStack.some((n) => IGNORED_ELEMENTS.has(n.tag));
  }
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        // if `true` use `DEFAULT_CONFIG`
        return config ? DEFAULT_CONFIG : false;
      }
      case 'object': {
        if (Array.isArray(config)) {
          return {
            allowlist: [...sanitizeConfigArray(config), ...DEFAULT_ALLOWLIST],
            globalAttributes: DEFAULT_GLOBAL_ATTRIBUTES,
            elementAttributes: DEFAULT_ELEMENT_ATTRIBUTES,
          };
        } else if (isValidConfigObjectFormat(config)) {
          return {
            allowlist: [...sanitizeConfigArray(config.allowlist), ...DEFAULT_ALLOWLIST],
            globalAttributes: [...(config.globalAttributes || []), ...DEFAULT_GLOBAL_ATTRIBUTES],
            elementAttributes: mergeObjects(config.elementAttributes, DEFAULT_ELEMENT_ATTRIBUTES),
          };
        }
        break;
      }
      case 'undefined': {
        return false;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * array -- an array of allowlisted strings (extends the default config)',
        '  * object -- An object with the following keys:',
        '    * `allowlist` -- An array of allowlisted strings (extends the default config)',
        '    * `globalAttributes` -- An array of attributes to check on every element (extends the default config)',
        '    * `elementAttributes` -- An object whose keys are tag names and value is an array of attributes to check for that tag name (extends the default config)',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      TextNode(node, path) {
        if (!node.loc) {
          return;
        }

        let parents = [...path.parents()];
        let attrPath = parents.find((it) => it.node.type === 'AttrNode');
        if (attrPath) {
          this._getBareStringAttribute(attrPath.node);
        } else {
          this._checkNodeAndLog(node, '', node.loc);
        }
      },

      ElementNode: {
        enter(node) {
          this._currentElementNode = node;
          this._elementStack.push(node);
        },
        exit() {
          this._elementStack.pop();
        },
      },
      MustacheStatement(node, path) {
        let parents = [...path.parents()];
        if (!parents.some((it) => it.node.type === 'AttrNode')) {
          this._checkNodeAndLog(node.path, '', node.loc);
        }

        if (isPageTitleHelper(node)) {
          for (let param of node.params) {
            this._checkNodeAndLog(param, '', param.loc);
          }
        }
      },
    };
  }

  _getBareStringAttribute(attribute) {
    let tag = this._currentElementNode.tag;
    let attributeType = attribute.name;
    let attributeValueNode = attribute.value;
    let additionalDescription = ` in \`${attributeType}\` ${
      attributeType.charAt(0) === '@' ? 'argument' : 'attribute'
    }`;
    let isGlobalAttribute = this.config.globalAttributes.includes(attributeType);
    let isElementAttribute =
      this.config.elementAttributes[tag] &&
      this.config.elementAttributes[tag].includes(attributeType);

    if (isGlobalAttribute || isElementAttribute) {
      this._checkNodeAndLog(attributeValueNode, additionalDescription, attribute.loc);
    }
  }

  _getBareString(_string) {
    let allowlist = this.config.allowlist;
    let string = _string;

    if (allowlist) {
      for (const entry of allowlist) {
        while (string.includes(entry)) {
          string = string.replace(entry, '');
        }
      }
    }

    return string.trim() === '' ? null : _string;
  }

  _checkNodeAndLog(node, additionalDescription, loc) {
    if (this._currentElementNode && this.isWithinIgnoredElement()) {
      return;
    }
    switch (node.type) {
      case 'TextNode': {
        let bareStringText = this._getBareString(node.chars);

        if (bareStringText) {
          this.log({
            message: `Non-translated string used${additionalDescription}`,
            node,
            line: loc.start.line,
            column: loc.start.column,
            source: bareStringText,
          });
        }

        break;
      }
      case 'ConcatStatement': {
        for (let i = 0; i < node.parts.length; i++) {
          let subNode = node.parts[i];
          this._checkNodeAndLog(subNode, additionalDescription, loc);
        }

        break;
      }
      case 'StringLiteral': {
        let bareStringText = this._getBareString(node.value);

        if (bareStringText) {
          this.log({
            message: `Non-translated string used${additionalDescription}`,
            node,
            line: loc.start.line,
            column: loc.start.column,
            source: bareStringText,
          });
        }

        break;
      }
      // No default
    }
  }
}

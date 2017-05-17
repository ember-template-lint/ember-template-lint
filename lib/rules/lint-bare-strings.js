'use strict';

/*
 Disallows the use of bare strings in a template

 ```
 {{! good }}
 <div>{{evaluatesToAString}}</div>
 <div>{{'A string'}}</div>

 {{! bad}}
 <div>A bare string</div>
 ```

 The following values are valid configuration:

   * boolean -- `true` for enabled / `false` for disabled
   * array -- an array of whitelisted strings
   * object -- An object with the following keys:
     * `whitelist` -- An array of whitelisted strings
     * `globalAttributes` -- An array of attributes to check on every element.
     * `elementAttributes` -- An object whose keys are tag names and value is an array of attributes to check for that tag name.
 */

const buildPlugin = require('./base');

const GLOBAL_ATTRIBUTES = [
  'title'
];

const TAG_ATTRIBUTES = {
  'input': [ 'placeholder' ],
  'img': [ 'alt' ]
};

const DEFAULT_CONFIG = {
  whitelist: ['(', ')', ',', '.', '&', '+', '-', '=', '*', '/', '#', '%', '!', '?', ':', '[', ']', '{', '}', '<', '>', '•', '—', ' ', '|'],
  globalAttributes: GLOBAL_ATTRIBUTES,
  elementAttributes: TAG_ATTRIBUTES
};

function isValidConfigObjectFormat(config) {
  for (let key in config) {
    let value = config[key];
    let valueType = typeof value;
    let valueIsArray = Array.isArray(value);

    if (key === 'whitelist' && !valueIsArray) {
      return false;
    } else if (key === 'globalAttributes' && !valueIsArray) {
      return false;
    } else if (key === 'elementAttributes' && valueType === 'object') {
      if (valueIsArray) { return false; }
    } else if (!DEFAULT_CONFIG[key]){
      return false;
    }
  }

  return true;
}

module.exports = function(addonContext) {
  return class LogStaticStrings extends buildPlugin(addonContext, 'bare-strings') {
    parseConfig(config) {
      let configType = typeof config;

      let errorMessage = 'The bare-strings rule accepts one of the following values.\n ' +
        '  * boolean - `true` to enable / `false` to disable\n' +
        '  * array -- an array of strings to whitelist\n' +
        '  * object -- An object with the following keys:' +
        '    * `whitelist` -- An array of whitelisted strings ' +
        '    * `globalAttributes` -- An array of attributes to check on every element.' +
        '    * `elementAttributes` -- An object whose keys are tag names and value is an array of attributes to check for that tag name. ' +
        '\nYou specified `' + JSON.stringify(config) + '`';

      switch (configType) {
      case 'boolean':
        // if `true` use `DEFAULT_CONFIG`
        return config ? DEFAULT_CONFIG : false;
      case 'object':
        if (Array.isArray(config)) {
          return {
            whitelist: config,
            globalAttributes: GLOBAL_ATTRIBUTES,
            elementAttributes: TAG_ATTRIBUTES
          };
        } else if (isValidConfigObjectFormat(config)) {
          // default any missing keys to empty values
          return {
            whitelist: config.whitelist || [],
            globalAttributes: config.globalAttributes || [],
            elementAttributes: config.elementAttributes || {}
          };
        } else {
          throw new Error(errorMessage);
        }
      case 'undefined':
        return false;
      default:
        throw new Error(errorMessage);
      }
    }

    visitors() {
      return {
        TextNode(node) {
          if (!node.loc) { return; }

          if (this._currentAttrNode) {
            this._getBareStringAttribute(this._currentAttrNode);
          } else {
            this._checkNodeAndLog(node, '', node.loc);
          }
        },

        ElementNode(node) {
          this._currentElementNode = node;
        },

        AttrNode: {
          enter(node) {
            this._currentAttrNode = node;
          },

          exit() {
            this._currentAttrNode = null;
          }
        }
      };
    }

    _getBareStringAttribute(attribute) {
      let tag = this._currentElementNode.tag;
      let attributeType = attribute.name;
      let attributeValueNode = attribute.value;
      let additionalDescription = ' in `' + attributeType + '` attribute';
      let isGlobalAttribute = this.config.globalAttributes.indexOf(attributeType) > -1;
      let isElementAttribute = this.config.elementAttributes[tag] && this.config.elementAttributes[tag].indexOf(attributeType) > -1;

      if (isGlobalAttribute || isElementAttribute) {
        this._checkNodeAndLog(attributeValueNode, additionalDescription, attribute.loc);
      }
    }

    _getBareString(_string) {
      let whitelist = this.config.whitelist;
      let string = _string;

      if (whitelist) {
        for (let i = 0; i < whitelist.length; i++) {
          let entry = whitelist[i];

          while (string.indexOf(entry) > -1) {
            string = string.replace(entry, '');
          }
        }
      }

      return string.trim() !== '' ? _string : null;
    }

    _checkNodeAndLog(node, additionalDescription, loc) {
      let bareStringText = this._getBareString(node.chars);

      if (bareStringText) {
        this.log({
          message: 'Non-translated string used' + additionalDescription,
          line: loc.start.line,
          column: loc.start.column,
          source: bareStringText
        });
      }
    }
  };
};

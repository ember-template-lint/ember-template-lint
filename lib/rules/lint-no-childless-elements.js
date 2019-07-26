'use strict';

const Rule = require('./base');
const createErrorMessage = require('../helpers/create-error-message');

let BASE_ALLOWED_CHILDLESS_TAGS = Object.freeze([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);
let ALLOWED_CHILDLESS_TAGS = [];
const ERROR_MESSAGE = 'Empty non-void elements are not allowed';

module.exports = class NoChildlessElements extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        return config;
      case 'object':
        if (Array.isArray(config.allow)) {
          // Merge allowed tags and ALLOWED_CHILDLESS_TAGS
          let newRuleSet = [...config.allow, ...BASE_ALLOWED_CHILDLESS_TAGS];
          // Ensure value uniqueness
          ALLOWED_CHILDLESS_TAGS = newRuleSet.filter(
            (tag, index) => newRuleSet.indexOf(tag) === index
          );
        }

        if (Array.isArray(config.block)) {
          // Remove tags from ALLOWED_CHILDLESS_TAGS
          ALLOWED_CHILDLESS_TAGS = BASE_ALLOWED_CHILDLESS_TAGS.filter(
            tag => config.block.indexOf(tag) < 0
          );
        }
        return true;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * object -- An object with the following keys:',
        '    * `allow` -- An array of whitelisted tags',
        '    * `block` -- An array of tags to check for child presence',
      ],
      config
    );

    throw new Error(errorMessage);
  }
  visitor() {
    return {
      ElementNode(node) {
        const isTagNotAllowed = !ALLOWED_CHILDLESS_TAGS.includes(node.tag);
        const isElementEmpty = !node.children.length;
        const shouldDisplayMessage = isTagNotAllowed && isElementEmpty;

        if (shouldDisplayMessage) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc.start.line,
            column: node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ALLOWED_CHILDLESS_TAGS = BASE_ALLOWED_CHILDLESS_TAGS;
module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

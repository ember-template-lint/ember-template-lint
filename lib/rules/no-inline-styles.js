'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./_base');

/**
 Disallow usage of elements with inline styles

 Good:

 ```
 <div class="class-with-inline-block-rule"></div>
 ```

 Bad:

 ```
 <div style="display:inline-block"></div>
 ```
 */

const DEFAULT_CONFIG = { allowDynamicStyles: true };

module.exports = class NoInlineStyles extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        return config ? DEFAULT_CONFIG : false;
      case 'object':
        return { allowDynamicStyles: config.allowDynamicStyles };
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * object -- An object with the following keys:',
        '    * `allowDynamicStyles` -- Whether dynamically-generated inline styles should be allowed (defaults to `true`)',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      ElementNode(node) {
        const style = AstNodeInfo.findAttribute(node, 'style');
        if (!style) {
          return;
        }

        const hasDynamicStyle = style.value.type === 'MustacheStatement';
        if (this.config.allowDynamicStyles && hasDynamicStyle) {
          return;
        }

        this.log({
          message: 'elements cannot have inline styles',
          node: style,
        });
      },
    };
  }
};

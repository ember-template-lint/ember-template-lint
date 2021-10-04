'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./_base');

module.exports = class NoHtmlComments extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        return config;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      ['  * boolean - `true` to enable / `false` to disable'],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      CommentStatement(node) {
        if (AstNodeInfo.isNonConfigurationHtmlComment(node)) {
          this.log({
            message: 'HTML comment detected',
            node,
            source: `<!--${node.value}-->`,
            fix: {
              text: `{{!${node.value}}}`,
            },
          });
        }
      },
    };
  }
};

'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

module.exports = class NoHtmlComments extends Rule {
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

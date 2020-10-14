'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const errorMessage =
  'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.';

module.exports = class NoAccesskeyAttribute extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (AstNodeInfo.hasAttribute(node, 'accesskey')) {
          this.log({
            message: errorMessage,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.errorMessage = errorMessage;

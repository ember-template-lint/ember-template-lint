'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

const errorMessage =
  'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard comments used by screenreader and keyboard only users create a11y complications.';

module.exports = class NoAccesskeyAttribute extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const accessKeyNode = AstNodeInfo.findAttribute(node, 'accesskey');
        if (accessKeyNode) {
          if (this.mode === 'fix') {
            node.attributes = node.attributes.filter((a) => a !== accessKeyNode);
          } else {
            this.log({
              message: errorMessage,
              isFixable: true,
              line: accessKeyNode.loc && accessKeyNode.loc.start.line,
              column: accessKeyNode.loc && accessKeyNode.loc.start.column,
              source: this.sourceForNode(accessKeyNode),
            });
          }
        }
      },
    };
  }
};

module.exports.errorMessage = errorMessage;

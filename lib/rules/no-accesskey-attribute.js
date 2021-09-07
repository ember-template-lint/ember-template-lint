'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./_base');

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
              node: accessKeyNode,
            });
          }
        }
      },
    };
  }
};

module.exports.errorMessage = errorMessage;

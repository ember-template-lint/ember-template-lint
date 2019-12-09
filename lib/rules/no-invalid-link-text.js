'use strict';

const Rule = require('./base');
const AstNodeInfo = require('../helpers/ast-node-info');

module.exports = class NoInvalidLinkText extends Rule {
  visitor() {
    return {
        TargetNodeType(node)  {

          // Conditions for rule detection go here

        {
          this.log({
            message: 'Error Message to Report',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node)
          });
        }
      }
    };
  }
};

'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

module.exports = class StyleConcat extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let style = AstNodeInfo.findAttribute(node, 'style');
        if (style && style.value.type === 'ConcatStatement') {
          this.log({
            message: 'You may not use string concatenation to build up styles',
            line: style.loc && style.loc.start.line,
            column: style.loc && style.loc.start.column,
            source: this.sourceForNode(style)
          });
        }
      }
    };
  }
};

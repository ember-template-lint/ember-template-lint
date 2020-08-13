'use strict';

const Rule = require('./base');

module.exports = class NoPotentialPathStrings extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        let { value } = node;
        if (
          value.type === 'TextNode' &&
          (value.chars.startsWith('@') || value.chars.startsWith('this.'))
        ) {
          this.log({
            message: NoPotentialPathStrings.generateErrorMessage(value.chars),
            line: value.loc && value.loc.start.line,
            column: value.loc && value.loc.start.column,
            source: this.sourceForNode(value),
          });
        }
      },
    };
  }

  static generateErrorMessage(path) {
    return `Potential path in attribute string detected. Did you mean {{${path}}}?`;
  }
};

'use strict';

const Rule = require('./base');

const errorMessage = element =>
  `Do not use <${element}> elements as they can create visual accessibility issues and are deprecated.`;

const DISTRACTING_ELEMENTS = ['marquee', 'blink'];

module.exports = class NoPositiveTabindex extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (DISTRACTING_ELEMENTS.includes(node.tag)) {
          this.log({
            message: errorMessage(node.tag),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

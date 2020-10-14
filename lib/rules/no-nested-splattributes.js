'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'Nested splattributes are not allowed';

module.exports = class NoNestedSplattributes extends Rule {
  visitor() {
    let splattributesParent = null;

    return {
      ElementNode: {
        enter(node) {
          let splattribute = node.attributes.find((it) => it.name === '...attributes');
          if (splattribute) {
            if (splattributesParent) {
              this.log({
                message: ERROR_MESSAGE,
                line: splattribute.loc && splattribute.loc.start.line,
                column: splattribute.loc && splattribute.loc.start.column,
                source: this.sourceForNode(splattribute),
              });
            } else {
              splattributesParent = node;
            }
          }
        },
        exit(node) {
          if (splattributesParent === node) {
            splattributesParent = null;
          }
        },
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

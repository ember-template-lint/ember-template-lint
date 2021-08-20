'use strict';

const Rule = require('./_base');

const ERROR_MESSAGE = 'Only `...attributes` can be applied to elements';

module.exports = class SplatAttributesOnly extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        if (node.name.startsWith('...') && node.name !== '...attributes') {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

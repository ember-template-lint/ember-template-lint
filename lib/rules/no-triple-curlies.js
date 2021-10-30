'use strict';

const Rule = require('./_base');

module.exports = class NoTripleCurlies extends Rule {
  visitor() {
    return {
      MustacheStatement(node) {
        if (!node.escaped) {
          this.log({
            message: 'Usage of triple curly brackets is unsafe',
            node,
            source: `{{{${node.path.original}}}}`,
          });
        }
      },
    };
  }
};

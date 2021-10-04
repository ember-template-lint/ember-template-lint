'use strict';

const Rule = require('./_base');

const DEPRECATION_URL = 'https://deprecations.emberjs.com/v3.x/#toc_ember-glimmer-with-syntax';
const ERROR_MESSAGE = `The use of \`{{with}}\` has been deprecated. Please see the deprecation guide at ${DEPRECATION_URL}.`;

module.exports = class NoWith extends Rule {
  visitor() {
    return {
      BlockStatement(node) {
        if (node.path.original === 'with') {
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

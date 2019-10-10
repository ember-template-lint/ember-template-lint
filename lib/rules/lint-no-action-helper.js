'use strict';

const Rule = require('./base');

const ERROR_MESSAGE =
  'Do not use the `action` helper. Instead, use the `on` modifier and `fn` helper.';

module.exports = class NoActionModifiers extends Rule {
  visitor() {
    let params = [];
    function addParams(items) {
      if (items.length) {
        params = params.concat(items);
      }
    }
    function removeParams(items) {
      if (items.length) {
        params = params.slice(0, -items.length);
      }
    }

    function detectActionHelper(node) {
      let maybeAction = node.path.original;
      if (maybeAction !== 'action') {
        return;
      }
      if (node.path.data === true || node.path.this === true) {
        return;
      }
      if (params.includes(maybeAction)) {
        return;
      }

      this.log({
        message: ERROR_MESSAGE,
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: this.sourceForNode(node),
      });
    }

    return {
      BlockStatement: {
        enter(node) {
          addParams(node.program ? node.program.blockParams : []);
        },
        exit(node) {
          addParams(node.program ? node.program.blockParams : []);
        },
      },
      ElementNode: {
        enter(node) {
          addParams(node.blockParams);
        },
        exit(node) {
          removeParams(node.blockParams);
        },
      },
      SubExpression: detectActionHelper,
      MustacheStatement: detectActionHelper,
      ElementModifierStatement: detectActionHelper,
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

'use strict';

const Rule = require('./_base');

const ERROR_MESSAGE = 'Do not use `action` as %. Instead, use the `on` modifier and `fn` helper.';

module.exports = class NoAction extends Rule {
  visitor() {
    const isLocal = this.isLocal.bind(this);
    const log = this.log.bind(this);
    let closestTag = null;

    function detectAction(node, usageContext) {
      if (isLocal(node.path)) {
        return;
      }
      let maybeAction = node.path.original;
      if (node.path.type === 'StringLiteral') {
        return;
      }
      if (maybeAction !== 'action') {
        return;
      }
      if (node.path.data === true || node.path.this === true) {
        return;
      }
      log({
        message: ERROR_MESSAGE.replace('%', usageContext),
        node,
      });
    }

    return {
      SubExpression: (node) => {
        detectAction(node, '(action ...)');
      },
      MustacheStatement: (node) => {
        detectAction(node, '{{action ...}}');
      },
      ElementNode: (node) => {
        closestTag = node.tag;
      },
      ElementModifierStatement: (node) => {
        detectAction(node, `<${closestTag} {{action ...}} />`);
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

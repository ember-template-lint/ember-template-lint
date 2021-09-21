'use strict';

const Rule = require('./_base');

const ERROR_MESSAGE = 'Do not use `route-action` as %. Instead, use controller actions.';

module.exports = class NoRouteAction extends Rule {
  visitor() {
    return {
      SubExpression: (node) => {
        this.detectRouteAction(node, '(route-action ...)');
      },
      MustacheStatement: (node) => {
        this.detectRouteAction(node, '{{route-action ...}}');
      },
    };
  }

  detectRouteAction(node, usageContext) {
    if (this.isLocal(node.path)) {
      return;
    }
    let maybeAction = node.path.original;
    if (node.path.type === 'StringLiteral') {
      return;
    }
    if (maybeAction !== 'route-action') {
      return;
    }
    if (node.path.data === true || node.path.this === true) {
      return;
    }
    this.log({
      message: ERROR_MESSAGE.replace('%', usageContext),
      node,
    });
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

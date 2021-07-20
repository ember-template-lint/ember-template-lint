'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'Do not use `route-action` as %. Instead, use controller actions.';

module.exports = class NoRouteAction extends Rule {
  visitor() {
    const isLocal = this.isLocal.bind(this);
    const log = this.log.bind(this);
    const sourceForNode = this.sourceForNode.bind(this);
    let closestTag = null;

    function detectRouteAction(node, usageContext) {
      if (isLocal(node.path)) {
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
      log({
        message: ERROR_MESSAGE.replace('%', usageContext),
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: sourceForNode(node),
      });
    }

    return {
      SubExpression: (node) => {
        detectRouteAction(node, '(route-action ...)');
      },
      MustacheStatement: (node) => {
        detectRouteAction(node, '{{route-action ...}}');
      },
      ElementNode: (node) => {
        closestTag = node.tag;
      },
      ElementModifierStatement: (node) => {
        detectRouteAction(node, `<${closestTag} {{route-action ...}} />`);
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

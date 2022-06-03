import Rule from './_base.js';

const ERROR_MESSAGE = 'Do not use `route-action` as %. Instead, use controller actions.';
const PLACE_HOLDER = '...';

export default class NoRouteAction extends Rule {
  visitor() {
    return {
      SubExpression: (node) => {
        this.detectRouteAction(node, `(route-action "${PLACE_HOLDER}")`);
      },
      MustacheStatement: (node) => {
        this.detectRouteAction(node, `{{route-action "${PLACE_HOLDER}"}}`);
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

    const routeActionName = node.params[0].value;

    this.log({
      message: ERROR_MESSAGE.replace('%', usageContext.replace(PLACE_HOLDER, routeActionName)),
      node,
    });
  }
}

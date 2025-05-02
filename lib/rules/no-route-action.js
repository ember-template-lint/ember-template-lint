import Rule from './_base.js';

export default class NoRouteAction extends Rule {
  visitor() {
    return {
      SubExpression: (node) => {
        this.detectRouteAction(node, true);
      },
      MustacheStatement: (node) => {
        this.detectRouteAction(node, false);
      },
    };
  }

  detectRouteAction(node, isSubExpression) {
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
      message: makeErrorMessage(routeActionName, isSubExpression),
      node,
    });
  }
}

function makeErrorMessage(actionName, isSubExpression) {
  const usageContext = isSubExpression
    ? `(route-action '${actionName}')`
    : `{{route-action '${actionName}'}}`;

  return `Do not use \`route-action\` as ${usageContext}. Instead, use controller actions.`;
}

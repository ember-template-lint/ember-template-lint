import Rule from './_base.js';

export default class NoDynamicSubexpressionInvocations extends Rule {
  logDynamicInvocation(node, path) {
    if (node.path.type !== 'PathExpression') {
      return;
    }

    let isLocal = this.scope.isLocal(node.path);
    let isPath = node.path.parts.length > 1;
    let isThisPath = node.path.original.startsWith('this.');
    let isNamedArgument = node.path.original.startsWith('@');
    let hasArguments = node.params.length > 0 || node.hash.length > 0;
    let isDynamic = isLocal || isNamedArgument || isPath || isThisPath;

    switch (node.type) {
      case 'ElementModifierStatement':
      case 'SubExpression': {
        if (isDynamic) {
          this.log({
            message: `You cannot invoke a dynamic value in the ${node.type} position`,
            node,
          });
        }
        break;
      }
      case 'MustacheStatement': {
        let parents = [...path.parents()];
        let isAttr = parents.some((it) => it.node.type === 'AttrNode');

        if (isAttr && isDynamic && hasArguments) {
          this.log({
            message: 'You must use the `fn` helper to create a function with arguments to invoke',
            node,
          });
        }
      }
    }
  }

  visitor() {
    return {
      MustacheStatement(node, path) {
        this.logDynamicInvocation(node, path);
      },

      SubExpression(node, path) {
        this.logDynamicInvocation(node, path);
      },

      ElementModifierStatement(node, path) {
        this.logDynamicInvocation(node, path);
      },
    };
  }
}

import Rule from './_base.js';

function makeErrorMessage(usageContext) {
  return `Do not use \`action\` as ${usageContext}. Instead, use the \`on\` modifier and \`fn\` helper.`;
}

export default class NoAction extends Rule {
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
        message: makeErrorMessage(usageContext),
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
}

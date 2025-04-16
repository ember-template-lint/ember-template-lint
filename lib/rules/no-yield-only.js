import Rule from './_base.js';

const ERROR_MESSAGE = '{{yield}}-only templates are not allowed';

function isEmptyNode(node) {
  return (
    node.type === 'MustacheCommentStatement' ||
    node.type === 'CommentStatement' ||
    (node.type === 'TextNode' && !node.chars.trim())
  );
}

function isYieldOnly(node) {
  return (
    node.type === 'MustacheStatement' && node.path.original === 'yield' && node.params.length === 0
  );
}

export default class NoYieldOnly extends Rule {
  visitor() {
    let isOnlyYield = false;
    return {
      Template(node) {
        const nonEmptyNodes = node.body.filter((n) => !isEmptyNode(n));
        if (nonEmptyNodes.length === 1 && isYieldOnly(nonEmptyNodes[0])) {
          // Don't actually trigger here so that we can get potential lint disable declarations
          isOnlyYield = true;
        }
      },
      MustacheStatement(node) {
        if (isOnlyYield) {
          this.log({
            message: ERROR_MESSAGE,
            node,
          });
        }
      },
    };
  }
}

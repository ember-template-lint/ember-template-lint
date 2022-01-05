import Rule from './_base.js';

export default class RequireSplattributes extends Rule {
  visitor() {
    let foundSplattributes = false;

    return {
      AttrNode(node) {
        if (node.name === '...attributes') {
          foundSplattributes = true;
        }
      },

      Template: {
        exit(node) {
          if (!foundSplattributes) {
            let { body } = node;
            let elementNodes = body.filter((it) => it.type === 'ElementNode');
            let nonEmptyTextNodes = body.filter((it) => it.type === 'TextNode' && it.chars.trim());
            if (elementNodes.length === 1 && nonEmptyTextNodes.length === 0) {
              this.report({
                message: 'The root element in this template should use `...attributes`',
                node: elementNodes[0],
              });
            } else {
              this.report({
                message: 'At least one element in this template should use `...attributes`',
                node,
              });
            }
          }
        },
      },
    };
  }

  report({ message, node }) {
    this.log({
      message,
      node,
    });
  }
}

import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

export default class NoHtmlComments extends Rule {
  visitor() {
    return {
      CommentStatement(node) {
        if (AstNodeInfo.isNonConfigurationHtmlComment(node)) {
          this.log({
            message: 'HTML comment detected',
            node,
            source: `<!--${node.value}-->`,
            fix: {
              text: `{{!${node.value}}}`,
            },
          });
        }
      },
    };
  }
}

import { builders as b } from 'ember-template-recast';

import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

export default class NoHtmlComments extends Rule {
  visitor() {
    return {
      CommentStatement(node) {
        if (AstNodeInfo.isNonConfigurationHtmlComment(node)) {
          if (this.mode === 'fix') {
            return b.mustacheComment(node.value);
          } else {
            this.log({
              message: 'HTML comment detected',
              node,
              source: `<!--${node.value}-->`,
              fix: {
                text: `{{!${node.value}}}`,
              },
              isFixable: true,
            });
          }
        }
      },
    };
  }
}

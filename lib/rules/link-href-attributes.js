'use strict';

const AstNodeInfo = require('../helpers/ast-node-info');
const Rule = require('./base');

/**
 Disallow usage of `<a>` without an `href` attribute.

 Good:

 ```
 <a href="http://localhost">
 ```

 Bad:

 ```
 <a>
 ```
*/
module.exports = class LinkHrefAttributes extends Rule {
  static get meta() {
    return {
      description: 'requires anchor tags to have href attribute',
      category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/link-href-attributes.md',
      fixable: false,
    };
  }
  visitor() {
    return {
      ElementNode(node) {
        if (AstNodeInfo.isLinkElement(node) && !AstNodeInfo.hasAttribute(node, 'href')) {
          this.log({
            message: 'a tags must have an href attribute',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

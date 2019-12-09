'use strict';

const Rule = require('./base');

const componentTemplateRegex = new RegExp(
  'templates/components|components/.*/template|ui/components|-components/'
);

module.exports = class LinkNoAttrComponent extends Rule {
  static get meta() {
    return {
      description: 'prevents use of `attrs` property to access values passed to component',
      category: 'Best Practices', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-attrs-in-component.md',
      fixable: false,
    };
  }
  isComponentTemplate() {
    return componentTemplateRegex.test(this._moduleName);
  }
  visitor() {
    return {
      PathExpression(node) {
        if (!this.isComponentTemplate()) {
          return;
        }
        if (node.parts && node.parts[0] === 'attrs') {
          this.log({
            message: 'Component templates should not contain `attrs`.',
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

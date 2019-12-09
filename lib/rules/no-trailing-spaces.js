'use strict';

const Rule = require('./base');

module.exports = class NoTrailingSpaces extends Rule {
  static get meta() {
    return {
      description: 'disallows trailing spaces at the end of lines',
      category: 'Stylistic Issues', // 'Stylistic Issues', 'Deprecated Rules', 'Possible Error', 'Best Practices',
      presets: {},
      url:
        'https://github.com/ember-template-lint/ember-template-lint/blog/master/docs/rules/no-trailing spaces.md',
      fixable: false,
    };
  }
  visitor() {
    return {
      Program: {
        // implementation goes here in exit(): in the exit handler, the rule will not
        // be called if it has been disabled by any inline comments within the file.

        exit(node) {
          let line = node.loc.start.line;
          let column = node.loc.start.column;

          // yielded content makes it in here too
          //
          // `{{#my-component}}
          //   test
          // {{/my-component}}`
          //
          // becomes
          //
          // `
          //   test
          // `
          //
          // check for that case
          if (line !== 1 || column !== 0) {
            return;
          }

          let source = this.sourceForNode(node);

          source.split('\n').forEach((line, i) => {
            let column = line.length - 1;
            if (line[column] === ' ') {
              this.log({
                message: 'line cannot end with space',
                line: i + 1,
                column,
                source: line,
              });
            }
          });
        },
      },
    };
  }
};

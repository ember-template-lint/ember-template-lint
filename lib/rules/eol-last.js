'use strict';

const createErrorMessage = require('../helpers/create-error-message');
const Rule = require('./base');

module.exports = class EolLast extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean':
        if (!config) {
          return false;
        }
        break;
      case 'string':
        if (config === 'editorconfig') {
          const configuredFinalNewline = this.editorConfig['insert_final_newline'];

          if (typeof configuredFinalNewline === 'boolean') {
            return configuredFinalNewline ? 'always' : 'never';
          } else {
            throw new TypeError(
              `The ${
                this.ruleName
              } rule allows setting the configuration to \`"editorconfig"\`, _only_ when an \`.editorconfig\` file with the \`insert_final_newline\` setting exists.\n\nWe found the following \`.editorconfig\`: ${JSON.stringify(
                this.editorConfig,
                null,
                2
              )}`
            );
          }
        }

        if (['always', 'never'].includes(config)) {
          return config;
        }

        break;
      case 'undefined':
        return false;
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '  * "always" - enforces that files end with a newline',
        '  * "editorconfig" - requires or disallows final newlines based your projects `.editorconfig` settings (via `insert_final_newline`)',
        '  * "never" - enforces that files do not end with a newline',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      Template: {
        // implementation goes here in exit(): in the exit handler, the rule will not
        // be called if it has been disabled by any inline comments within the file.

        exit(node) {
          let bodyLength = node.body.length;
          // if there is a block component invocation without a body
          // it will make it here too
          // check for that case
          if (bodyLength === 0) {
            return;
          }

          let source = this.sourceForNode(node);

          let lastChar = source[source.length - 1];
          let message;
          switch (this.config) {
            case 'always':
              if (lastChar !== '\n') {
                message = 'template must end with newline';
              }
              break;
            case 'never':
              if (lastChar === '\n') {
                message = 'template cannot end with newline';
              }
              break;
          }

          if (message) {
            let line = node.loc.start.line;
            let column = node.loc.start.column;

            this.log({
              message,
              line,
              column,
              source,
            });
          }
        },
      },
    };
  }
};

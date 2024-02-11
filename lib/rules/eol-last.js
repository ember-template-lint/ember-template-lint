import { builders as b } from 'ember-template-recast';

import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

export default class EolLast extends Rule {
  parseConfig(config) {
    // In strict mode (= template is embedded in e.g. a JS file) we want to disable this rule,
    // because it is not meant for templates specifically, but for template files.
    if (!this.isStrictMode) {
      return false;
    }

    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        if (!config) {
          return false;
        }
        break;
      }
      case 'string': {
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
      }
      case 'undefined': {
        return false;
      }
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

          let lastNode = node.body[node.body.length - 1];

          if (this.mode === 'fix') {
            if (
              lastNode.type === 'TextNode' &&
              lastNode.chars.endsWith('\n') &&
              this.config === 'never'
            ) {
              lastNode.chars = lastNode.chars.slice(0, -1);
            } else if (
              lastNode.type === 'TextNode' &&
              !lastNode.chars.endsWith('\n') &&
              this.config === 'always'
            ) {
              lastNode.chars = `${lastNode.chars}\n`;
            } else if (lastNode.type !== 'TextNode' && this.config === 'always') {
              node.body.push(b.text('\n'));
            }
          } else {
            let message;
            let source = this.sourceForNode(node);

            let lastChar = source[source.length - 1];
            switch (this.config) {
              case 'always': {
                if (lastChar !== '\n') {
                  message = 'template must end with newline';
                }
                break;
              }
              case 'never': {
                if (lastChar === '\n') {
                  message = 'template cannot end with newline';
                }
                break;
              }
            }

            if (message) {
              this.log({
                message,
                node,
                source,
                isFixable: true,
              });
            }
          }
        },
      },
    };
  }
}

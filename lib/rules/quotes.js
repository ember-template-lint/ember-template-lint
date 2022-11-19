import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

export default class Quotes extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        if (!config) {
          return false;
        }
        break;
      }
      case 'string': {
        if (['double', 'single'].includes(config)) {
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
        '  * "double" - requires the use of double quotes wherever possible',
        '  * "single" - requires the use of single quotes wherever possible',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    let badChar;
    let goodChar;
    let message;
    switch (this.config) {
      case 'double': {
        badChar = "'";
        goodChar = '"';
        message = 'you must use double quotes in templates';
        break;
      }
      case 'single': {
        badChar = '"';
        goodChar = "'";
        message = 'you must use single quotes in templates';
        break;
      }
    }

    return {
      AttrNode(node) {
        if (!node.isValueless && node.quoteType === badChar) {
          if (attrValueHasChar(node.value, goodChar)) {
            // TODO: Autofix blocked on: https://github.com/ember-template-lint/ember-template-recast/issues/698
            return this.log({
              message,
              node,
            });
          }
          if (this.mode === 'fix') {
            node.quoteType = goodChar;
          } else {
            return this.log({
              message,
              node,
              isFixable: true,
            });
          }
        }
      },

      StringLiteral(node, path) {
        let errorSource = this.sourceForNode(path.parentNode);

        if (node.quoteType === badChar) {
          if (node.value.includes(goodChar)) {
            // TODO: Autofix blocked on: https://github.com/ember-template-lint/ember-template-recast/issues/698
            return this.log({
              message,
              node,
              source: errorSource,
            });
          }
          if (this.mode === 'fix') {
            node.quoteType = goodChar;
          } else {
            return this.log({
              message,
              node,
              source: errorSource,
              isFixable: true,
            });
          }
        }
      },
    };
  }
}

function attrValueHasChar(node, ch) {
  if (node.type === 'TextNode') {
    return node.chars.includes(ch);
  } else if (node.type === 'ConcatStatement') {
    return node.parts.some((n) => {
      return n.type === 'TextNode' && n.chars.includes(ch);
    });
  }
  return false;
}

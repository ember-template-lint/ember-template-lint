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
          return {
            hbs: config,
            html: config,
          };
        }
        break;
      }
      case 'object': {
        if (
          ['double', 'single'].includes(config.hbs) &&
          ['double', 'single'].includes(config.html)
        ) {
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
        '  * { hbs: `single`|`double`, html: `single`|`double` } - requires different quotes for Handlebars and HTML syntax',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    const chars = {
      single: "'",
      double: '"',
    };
    const goodChars = {
      hbs: chars[this.config.hbs],
      html: chars[this.config.html],
    };
    const badChars = {
      hbs: goodChars.hbs === chars.single ? chars.double : chars.single,
      html: goodChars.html === chars.single ? chars.double : chars.single,
    };

    let message;

    if (goodChars.hbs === chars.single && goodChars.html === chars.single) {
      message = 'you must use single quotes in templates';
    } else if (goodChars.hbs === chars.double && goodChars.html === chars.double) {
      message = 'you must use double quotes in templates';
    } else {
      message = 'you must use double quotes x and single quotes in y in templates';
    }

    return {
      AttrNode(node) {
        if (!node.isValueless && node.quoteType === badChars.html) {
          if (attrValueHasChar(node.value, goodChars.html)) {
            // TODO: Autofix blocked on: https://github.com/ember-template-lint/ember-template-recast/issues/698
            return this.log({
              message,
              node,
            });
          }
          if (this.mode === 'fix') {
            node.quoteType = goodChars.html;
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

        if (node.quoteType === badChars.hbs) {
          if (node.value.includes(goodChars.hbs)) {
            // TODO: Autofix blocked on: https://github.com/ember-template-lint/ember-template-recast/issues/698
            return this.log({
              message,
              node,
              source: errorSource,
            });
          }
          if (this.mode === 'fix') {
            node.quoteType = goodChars.hbs;
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

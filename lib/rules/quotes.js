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
            curlies: config,
            html: config,
          };
        }
        break;
      }
      case 'object': {
        if (
          Object.keys(config).length === 2 &&
          ['double', 'single', false].includes(config.curlies) &&
          ['double', 'single', false].includes(config.html)
        ) {
          if (!config.curlies && !config.html) {
            return false;
          }
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
        '  * { curlies: "single"|"double"|false, html: "single"|"double"|false } - requires different quotes for Handlebars and HTML syntax',
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
      curlies: chars[this.config.curlies],
      html: chars[this.config.html],
    };
    const badChars = {};
    if (goodChars.curlies) {
      badChars.curlies = goodChars.curlies === chars.single ? chars.double : chars.single;
    }
    if (goodChars.html) {
      badChars.html = goodChars.html === chars.single ? chars.double : chars.single;
    }

    let message;

    if (goodChars.curlies === chars.single && goodChars.html === chars.single) {
      message = 'you must use single quotes in templates';
    } else if (goodChars.curlies === chars.double && goodChars.html === chars.double) {
      message = 'you must use double quotes in templates';
    } else if (!goodChars.curlies || !goodChars.html) {
      const correctQuote =
        goodChars.curlies === chars.single || goodChars.html === chars.single ? 'single' : 'double';
      message = `you must use ${correctQuote} quotes in ${
        goodChars.curlies ? 'Handlebars syntax' : 'HTML attributes'
      }`;
    } else {
      const double = goodChars.curlies === chars.double ? 'Handlebars syntax' : 'HTML attributes';
      const single = goodChars.curlies === chars.single ? 'Handlebars syntax' : 'HTML attributes';

      message = `you must use double quotes for ${double} and single quotes for ${single} in templates`;
    }

    return {
      AttrNode(node) {
        if (!goodChars.html) {
          return;
        }

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
        if (!goodChars.curlies) {
          return;
        }

        let errorSource = this.sourceForNode(path.parentNode);

        if (node.quoteType === badChars.curlies) {
          if (node.value.includes(goodChars.curlies)) {
            // TODO: Autofix blocked on: https://github.com/ember-template-lint/ember-template-recast/issues/698
            return this.log({
              message,
              node,
              source: errorSource,
            });
          }
          if (this.mode === 'fix') {
            node.quoteType = goodChars.curlies;
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

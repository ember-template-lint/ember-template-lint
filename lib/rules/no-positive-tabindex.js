import AstNodeInfo from '../helpers/ast-node-info.js';
import Rule from './_base.js';

const errorMessage = 'Avoid positive integer values for tabindex.';
const errorMessageForNaNCase = 'Tabindex values must be negative numeric.';

function literalValueToNumber(astNode) {
  if (astNode.type === 'NumberLiteral') {
    return astNode.original;
  } else if (astNode.type === 'StringLiteral') {
    return Number.parseInt(astNode.original, 10);
  } else {
    return Number.NaN;
  }
}

function maybeLiteralValue(astNode, defaultValue) {
  if (['NumberLiteral', 'StringLiteral'].includes(astNode.type)) {
    return literalValueToNumber(astNode);
  } else {
    return defaultValue;
  }
}

function parseTabIndexFromMustache(mustacheNode) {
  let tabindexValue;

  if (['NumberLiteral', 'StringLiteral'].includes(mustacheNode.path.type)) {
    tabindexValue = literalValueToNumber(mustacheNode.path);
  } else if (
    mustacheNode.path.type === 'PathExpression' &&
    (mustacheNode.path.original === 'if' || mustacheNode.path.original === 'unless')
  ) {
    if (mustacheNode.params.length === 2 || mustacheNode.params.length === 3) {
      tabindexValue = maybeLiteralValue(mustacheNode.params[1], tabindexValue);
    }
    if (mustacheNode.params.length === 3) {
      let maybeTabindexValue = maybeLiteralValue(mustacheNode.params[2], tabindexValue);
      if (maybeTabindexValue > tabindexValue) {
        tabindexValue = maybeTabindexValue;
      }
    }
  }

  return tabindexValue;
}

export default class NoPositiveTabindex extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        const tabindex = AstNodeInfo.findAttribute(node, 'tabindex');

        if (!tabindex || !tabindex.value) {
          return;
        }

        let tabindexValue = Number.NaN;

        switch (tabindex.value.type) {
          case 'MustacheStatement': {
            if (tabindex.value.path) {
              tabindexValue = parseTabIndexFromMustache(tabindex.value);
            }

            break;
          }
          case 'ConcatStatement': {
            let part = tabindex.value.parts[0];
            if (part.type === 'MustacheStatement') {
              tabindexValue = parseTabIndexFromMustache(part);
            }

            break;
          }
          case 'TextNode': {
            tabindexValue = Number.parseInt(tabindex.value.chars, 10);

            break;
          }
          // No default
        }

        // eslint-disable-next-line unicorn/prefer-number-properties
        if (isNaN(tabindexValue)) {
          this.log({
            message: errorMessageForNaNCase,
            node,
            source: this.sourceForNode(tabindex),
          });
        } else if (tabindexValue > 0) {
          this.log({
            message: errorMessage,
            node,
            source: this.sourceForNode(tabindex),
          });
        }
      },
    };
  }
}

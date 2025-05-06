import { builders as b } from 'ember-template-recast';

import Rule from './_base.js';

function cloneIfTextNode(node) {
  if (node.type === 'MustacheStatement') {
    return node;
  }

  return b.text(node.chars);
}

function getAttributeName(node) {
  return node.name;
}

function getAttributePosition(node) {
  const name = getAttributeName(node);

  if (name.startsWith('@')) {
    return 1;
  }

  if (name === '...attributes') {
    return 3;
  }

  return 2;
}

function getHashPairName(node) {
  return node.key;
}

function getModifierName(node) {
  if (node.path.type !== 'PathExpression') {
    return '';
  }

  return node.path.original;
}

function compareAttributes(a, b) {
  const positionA = getAttributePosition(a);
  const positionB = getAttributePosition(b);

  if (positionA > positionB) {
    return 1;
  }

  if (positionB > positionA) {
    return -1;
  }

  const nameA = getAttributeName(a);
  const nameB = getAttributeName(b);

  if (nameA > nameB) {
    return 1;
  }

  if (nameB > nameA) {
    return -1;
  }

  return 0;
}

function compareHashPairs(a, b) {
  const nameA = getHashPairName(a);
  const nameB = getHashPairName(b);

  if (nameA > nameB) {
    return 1;
  }

  if (nameB > nameA) {
    return -1;
  }

  return 0;
}

function compareModifiers(a, b) {
  const nameA = getModifierName(a);
  const nameB = getModifierName(b);

  if (nameA > nameB) {
    return 1;
  }

  if (nameB > nameA) {
    return -1;
  }

  if (nameA !== 'on') {
    return 0;
  }

  // Sort {{on}} modifiers
  const eventA = a.params[0];
  const eventB = b.params[0];

  if (eventA.type === 'StringLiteral' && eventB.type === 'StringLiteral') {
    const eventNameA = eventA.original;
    const eventNameB = eventB.original;

    if (eventNameA > eventNameB) {
      return 1;
    }

    if (eventNameB > eventNameA) {
      return -1;
    }
  }

  return 0;
}

function canSkipSortAttributes(attributes) {
  let canSkip = true;

  for (let i = 0; i < attributes.length - 1; i++) {
    if (compareAttributes(attributes[i], attributes[i + 1]) === 1) {
      canSkip = false;

      break;
    }
  }

  return canSkip;
}

function canSkipSortHash(hash) {
  let canSkip = true;

  for (let i = 0; i < hash.pairs.length - 1; i++) {
    if (compareHashPairs(hash.pairs[i], hash.pairs[i + 1]) === 1) {
      canSkip = false;

      break;
    }
  }

  return canSkip;
}

function canSkipSortModifiers(modifiers) {
  let canSkip = true;

  for (let i = 0; i < modifiers.length - 1; i++) {
    if (compareModifiers(modifiers[i], modifiers[i + 1]) === 1) {
      canSkip = false;

      break;
    }
  }

  return canSkip;
}

function sortAttributes(attributes) {
  return attributes.sort(compareAttributes).map((attribute) => {
    const { name, value } = attribute;

    switch (value.type) {
      case 'ConcatStatement': {
        // Bug in ember-template-recast@6.1.5 (it removes TextNode's with a single character)
        const parts = value.parts.map(cloneIfTextNode);

        // eslint-disable-next-line unicorn/prefer-spread
        return b.attr(name, b.concat(parts));
      }

      case 'TextNode': {
        // Bug in ember-template-recast@6.1.5 (it removes values that are an empty string)
        if (value.chars === '') {
          const { start, end } = value.loc;

          const isValueUndefined = start.line === end.line && start.column === end.column;

          if (!isValueUndefined) {
            return b.attr(name, b.mustache(b.string('')));
          }
        }

        break;
      }
    }

    return b.attr(name, value);
  });
}

function sortHash(hash) {
  return b.hash(hash.pairs.sort(compareHashPairs));
}

function sortModifiers(modifiers) {
  return modifiers.sort(compareModifiers).map((modifier) => {
    const { hash, params, path } = modifier;

    return b.elementModifier(path, params, hash);
  });
}

export default class SortInvocations extends Rule {
  /**
   * @returns {import('./types.js').VisitorReturnType<SortInvocations>}
   */
  visitor() {
    return {
      BlockStatement(node) {
        const { hash, params, path } = node;

        if (canSkipSortHash(hash)) {
          return;
        }

        if (this.mode === 'fix') {
          node = b.block(path, params, sortHash(hash), b.blockItself());
        } else {
          this.log({
            isFixable: true,
            message: 'Hash keys must be sorted',
            node,
          });
        }
      },

      ElementNode(node) {
        const { attributes, modifiers } = node;

        if (!canSkipSortAttributes(attributes)) {
          if (this.mode === 'fix') {
            node.attributes = sortAttributes(attributes);
          } else {
            this.log({
              isFixable: true,
              message: 'Arguments and attributes must be sorted',
              node,
            });
          }
        }

        if (!canSkipSortModifiers(modifiers)) {
          if (this.mode === 'fix') {
            node.modifiers = sortModifiers(modifiers);
          } else {
            this.log({
              isFixable: true,
              message: 'Modifiers must be sorted',
              node,
            });
          }
        }
      },

      MustacheStatement(node) {
        const { hash } = node;

        if (canSkipSortHash(hash)) {
          return;
        }

        if (this.mode === 'fix') {
          node.hash = sortHash(hash);
        } else {
          this.log({
            isFixable: true,
            message: 'Hash keys must be sorted',
            node,
          });
        }
      },

      SubExpression(node) {
        const { hash, params, path } = node;

        if (canSkipSortHash(hash)) {
          return;
        }

        if (this.mode === 'fix') {
          node = b.sexpr(path, params, sortHash(hash));
        } else {
          this.log({
            isFixable: true,
            message: 'Hash keys must be sorted',
            node,
          });
        }
      },
    };
  }
}

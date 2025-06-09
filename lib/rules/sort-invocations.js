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

function canSkipListSplattributesLast(node) {
  const { attributes, modifiers } = node;

  const splattributes = attributes.at(-1);
  const lastModifier = modifiers.at(-1);

  if (splattributes?.name !== '...attributes' || !lastModifier) {
    return true;
  }

  // Check that ...attributes appears after the last modifier
  const splattributesPosition = splattributes.loc.start;
  const lastModifierPosition = lastModifier.loc.start;

  if (splattributesPosition.line > lastModifierPosition.line) {
    return true;
  }

  return splattributesPosition.column > lastModifierPosition.column;
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

function getUnsortedAttributeIndex(attributes) {
  return attributes.findIndex((attribute, index) => {
    if (index === attributes.length - 1) {
      return false;
    }

    return compareAttributes(attribute, attributes[index + 1]) === 1;
  });
}

function getUnsortedHashPairIndex(hash) {
  return hash.pairs.findIndex((hashPair, index) => {
    if (index === hash.pairs.length - 1) {
      return false;
    }

    return compareHashPairs(hashPair, hash.pairs[index + 1]) === 1;
  });
}

function getUnsortedModifierIndex(modifiers) {
  return modifiers.findIndex((modifier, index) => {
    if (index === modifiers.length - 1) {
      return false;
    }

    return compareModifiers(modifier, modifiers[index + 1]) === 1;
  });
}

function listSplattributesLast(node) {
  let { attributes, modifiers } = node;

  const splattributes = attributes.at(-1);

  // Assign each modifier the location of its predecessor
  let start = splattributes.loc.start;

  modifiers = modifiers.map((modifier) => {
    const { hash, loc, params, path } = modifier;

    const newLocation = {
      start,
      end: {
        column: start.column + (loc.end.column - loc.start.column),
        line: start.line + (loc.end.line - loc.start.line) + 1,
      },
    };

    start = newLocation.end;

    return b.elementModifier(path, params, hash, newLocation);
  });

  // Assign ...attributes the original location of the last modifier
  attributes.splice(
    -1,
    1,
    b.attr('...attributes', b.text(''), {
      start,
      end: {
        column: start.column + '...attributes'.length,
        line: start.line,
      },
    })
  );

  return {
    attributes,
    modifiers,
  };
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

        let index = getUnsortedHashPairIndex(hash);

        if (index === -1) {
          return;
        }

        if (this.mode === 'fix') {
          node = b.block(path, params, sortHash(hash), b.blockItself());
        } else {
          this.log({
            isFixable: true,
            message: `\`${getHashPairName(hash.pairs[index])}\` must appear after \`${getHashPairName(hash.pairs[index + 1])}\``,
            node,
          });
        }
      },

      ElementNode(node) {
        const { attributes, modifiers } = node;

        let index = getUnsortedAttributeIndex(attributes);

        if (index !== -1) {
          if (this.mode === 'fix') {
            node.attributes = sortAttributes(attributes);
          } else {
            this.log({
              isFixable: true,
              message: `\`${getAttributeName(attributes[index])}\` must appear after \`${getAttributeName(attributes[index + 1])}\``,
              node,
            });
          }
        }

        index = getUnsortedModifierIndex(modifiers);

        if (index !== -1) {
          if (this.mode === 'fix') {
            node.modifiers = sortModifiers(modifiers);
          } else {
            this.log({
              isFixable: true,
              message: `\`{{${getModifierName(modifiers[index])}}}\` must appear after \`{{${getModifierName(modifiers[index + 1])}}}\``,
              node,
            });
          }
        }

        if (!canSkipListSplattributesLast(node)) {
          if (this.mode === 'fix') {
            const { attributes, modifiers } = listSplattributesLast(node);

            node.attributes = attributes;
            node.modifiers = modifiers;
          } else {
            this.log({
              isFixable: true,
              message: `\`...attributes\` must appear after modifiers`,
              node,
            });
          }
        }
      },

      MustacheStatement(node) {
        const { hash } = node;

        let index = getUnsortedHashPairIndex(hash);

        if (index === -1) {
          return;
        }

        if (this.mode === 'fix') {
          node.hash = sortHash(hash);
        } else {
          this.log({
            isFixable: true,
            message: `\`${getHashPairName(hash.pairs[index])}\` must appear after \`${getHashPairName(hash.pairs[index + 1])}\``,
            node,
          });
        }
      },

      SubExpression(node) {
        const { hash, params, path } = node;

        let index = getUnsortedHashPairIndex(hash);

        if (index === -1) {
          return;
        }

        if (this.mode === 'fix') {
          node = b.sexpr(path, params, sortHash(hash));
        } else {
          this.log({
            isFixable: true,
            message: `\`${getHashPairName(hash.pairs[index])}\` must appear after \`${getHashPairName(hash.pairs[index + 1])}\``,
            node,
          });
        }
      },
    };
  }
}

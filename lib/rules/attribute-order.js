import { builders as b } from 'ember-template-recast';

import createErrorMessage from '../helpers/create-error-message.js';
import isValidConfigObjectFormat from '../helpers/is-valid-config-object.js';
import replaceNode from '../helpers/replace-node.js';
import Rule from './_base.js';

const ERROR_MESSAGE = 'Your config does not match the allowed values';

// The parts of an ElementNode or MustacheStatement that this rule is concerned with
// These are also nodes themselves
const TokenType = {
  ARGUMENTS: 'arguments',
  ATTRIBUTES: 'attributes',
  MODIFIERS: 'modifiers',
  SPLATTRIBUTES: 'splattributes',
  COMMENTS: 'comments',
};

const DEFAULT_CONFIG = {
  alphabetize: true,
  order: [TokenType.ARGUMENTS, TokenType.ATTRIBUTES, TokenType.MODIFIERS],
};

export function createAttributesOrderErrorMessage(config) {
  return createErrorMessage('attribute-order', ERROR_MESSAGE, config);
}

// Class representing all of attribute tokens of a given tokenType for a node
class TokenGroup {
  _items;
  _context;

  constructor(items, context) {
    this._items = items;
    this._context = context;
  }

  // all of the nodes belonging to the tokenGroup
  get items() {
    return this._items;
  }

  get exists() {
    return this.items.length > 0;
  }

  // indexes of the nodes belonging to the tokenGroup
  get indexes() {
    return this.items.map((node) => this._context.calculateAttributeIndex(node));
  }

  // the largest index of the tokenGroup
  get lastIndex() {
    return this.indexes.length ? Math.max(...this.indexes) : undefined;
  }

  // the smallest index of the tokenGroup
  get firstIndex() {
    return this.indexes.length ? Math.min(...this.indexes) : undefined;
  }

  // the first unalphabetized node of the tokenGroup
  get unalphabetizedItemIndex() {
    const alpha = this.items.map((attr) => {
      return this._context.sourceForNode(attr).match(/([^A-Za-z]*)([\w-]*)/)[2];
    });
    return alpha.findIndex((e, idx) => idx > 0 && e < alpha[idx - 1]);
  }
}

export default class AttributeOrder extends Rule {
  appliedOrder = undefined;

  parseConfig(config) {
    const errorMessage = createAttributesOrderErrorMessage(config);
    if (!isValidConfigObjectFormat(config, DEFAULT_CONFIG)) {
      throw new Error(errorMessage);
    }

    if (config === false) {
      return false;
    }

    if (typeof config === 'object') {
      if (
        config.order &&
        ![TokenType.ARGUMENTS, TokenType.ATTRIBUTES, TokenType.MODIFIERS].every((attribute) =>
          config.order.includes(attribute)
        )
      ) {
        throw new Error(errorMessage);
      }
      return { ...DEFAULT_CONFIG, ...config };
    }

    return DEFAULT_CONFIG;
  }

  /**
   *
   * @param {object} tokenGroups
   * @returns {boolean} True if splattributes are surrounded/enclosed by tokens on the left and right
   * When surrounded, the ordering relative to splattributes must remain intact which prevents this rule from auto-fixing.
   */
  areSplattributesSurrounded(tokenGroups) {
    const splattributeLastIndex = tokenGroups[TokenType.SPLATTRIBUTES].lastIndex;
    if (splattributeLastIndex < 0) {
      return false;
    }
    const maxIndex = Math.max(
      ...Object.values(tokenGroups).map(
        (tokenGroup) => tokenGroup.lastIndex || Number.NEGATIVE_INFINITY
      )
    );
    const minIndex = Math.min(
      ...Object.values(tokenGroups).map(
        (tokenGroup) => tokenGroup.firstIndex || Number.POSITIVE_INFINITY
      )
    );
    return splattributeLastIndex > minIndex && splattributeLastIndex < maxIndex;
  }

  /**
   *
   * @param {object} node
   * @returns {number} A number representing the relative location of the node
   */
  calculateAttributeIndex(node) {
    return node.loc.start.line * node.loc.start.column;
  }

  /**
   *
   * @param {object} tokenGroups
   * @param {TokenType} tokenType
   * @returns {number} Index representing the order in which a tokenType should be sorted
   */
  getOrder(tokenGroups, tokenType) {
    return this.getAppliedOrder(tokenGroups).indexOf(tokenType);
  }

  /**
   *
   * @param {object} tokenGroups
   * @returns {array} The order of attributes given a particular node
   * If splattributes are in the first or last position they should remain in that order
   */
  getAppliedOrder(tokenGroups) {
    if (this.appliedOrder) {
      return this.appliedOrder;
    }
    const maxLastIndex = Math.max(
      ...Object.values(tokenGroups)
        .map((tokenGroup) => tokenGroup.lastIndex)
        .filter((i) => Number.isInteger(i))
    );
    const minLastIndex = Math.min(
      ...Object.values(tokenGroups)
        .map((tokenGroup) => tokenGroup.lastIndex)
        .filter((i) => Number.isInteger(i))
    );

    const orderMinusSplattributes = this.config.order.filter(
      (attribute) => attribute !== TokenType.SPLATTRIBUTES
    );
    const splattributeLastIndex = tokenGroups[TokenType.SPLATTRIBUTES]
      ? tokenGroups[TokenType.SPLATTRIBUTES].lastIndex
      : undefined;
    const attributeLastIndex = tokenGroups[TokenType.ATTRIBUTES]
      ? tokenGroups[TokenType.ATTRIBUTES].lastIndex
      : undefined;

    if (
      splattributeLastIndex === maxLastIndex ||
      (splattributeLastIndex && splattributeLastIndex > attributeLastIndex)
    ) {
      this.appliedOrder = [...orderMinusSplattributes, TokenType.SPLATTRIBUTES];
    } else if (
      splattributeLastIndex === minLastIndex ||
      (splattributeLastIndex && splattributeLastIndex < attributeLastIndex)
    ) {
      this.appliedOrder = [TokenType.SPLATTRIBUTES, ...orderMinusSplattributes];
    } else {
      this.appliedOrder = [...orderMinusSplattributes, TokenType.SPLATTRIBUTES];
    }
    return this.appliedOrder;
  }

  /**
   *
   * @param {object} node
   * @param {string} nodeText
   * @returns {array} All possible tokens.  Mustache statements can only contain attributes.
   */
  getMustacheStatementTokens(node) {
    const keys = [];
    for (const attr of node.hash.pairs) {
      keys.push([TokenType.ATTRIBUTES, attr]);
    }
    return keys;
  }

  /**
   *
   * @param {object} node
   * @param {string} nodeText
   * @returns {array} All possible tokens.  Mustache statements can only contain attributes.
   */
  getElementNodeTokens(node) {
    const keys = [];
    for (const attr of node.attributes) {
      const type = this.getTokenType(attr);
      keys.push([type, attr]);
    }
    for (const modifier of node.modifiers) {
      keys.push([TokenType.MODIFIERS, modifier]);
    }
    for (const comment of node.comments) {
      keys.push([TokenType.COMMENTS, comment]);
    }
    return keys;
  }

  /**
   *
   * @param {string} tokenType
   * @returns {string} Categorical type (either attributes or modifiers) of the attribute.
   * Arguments, attributes and splattributes are considered attributes.
   */
  getTokenCategory(tokenType) {
    return [TokenType.ARGUMENTS, TokenType.ATTRIBUTES, TokenType.SPLATTRIBUTES].includes(tokenType)
      ? TokenType.ATTRIBUTES
      : tokenType;
  }

  /**
   *
   * @param {object} node
   * @returns The specific type of token (arguments, splattributes, attributes or modifiers) which can be ordered.
   */
  getTokenType(node) {
    if (node.type && node.type.includes('Comment')) {
      return TokenType.COMMENTS;
    }
    if (!node.name) {
      return TokenType.MODIFIERS;
    }
    return node.name.startsWith('@')
      ? TokenType.ARGUMENTS
      : node.name.startsWith('...')
        ? TokenType.SPLATTRIBUTES
        : TokenType.ATTRIBUTES;
  }

  /**
   *
   * @param {object} attr
   * @param {object} config
   * @returns Matching node based on config values from tokenGroups
   */
  getNode(tokenGroups, { type, name, value }) {
    for (const tokenGroup of Object.values(tokenGroups)) {
      const items = tokenGroup.items;
      for (const node of items) {
        if (node.type === type && ((node.name && node.name === name) || node.value === value)) {
          return node;
        }
      }
    }
  }

  /**
   *
   * @param {object} node
   * @param {object} config
   * @returns Matching node based on config values from tokenGroups
   */
  makeToken({ nodeType, node, loc }) {
    switch (nodeType) {
      case TokenType.MODIFIERS: {
        return b.elementModifier(b.path(node.path), node.params, node.hash, loc);
      }

      case TokenType.COMMENTS: {
        return node.type === 'MustacheCommentStatement'
          ? b.mustacheComment(node.value, loc)
          : b.comment(node.value, loc);
      }

      default: {
        return b.attr(node.name, node.value, loc);
      }
    }
  }

  /**
   *
   * @param {object} node
   * @param {object} config
   * @returns {node} Matching node based on config values from tokenGroups
   */
  groupTokens(tokens) {
    const result = Object.values(TokenType).reduce((acc, tokenType) => {
      acc[tokenType] = [];
      return acc;
    }, {});
    for (let [tokenType, node] of tokens) {
      result[tokenType].push(node);
    }
    return result;
  }

  /**
   *
   * @param {object} tokens
   * @returns {object} Object keyed by TokenType each containing a TokenGroup
   */
  makeTokenGroups(tokens) {
    const tokenGroups = {};
    for (const tokenType of Object.keys(tokens)) {
      tokenGroups[tokenType] = new TokenGroup(tokens[tokenType], this);
    }
    return tokenGroups;
  }

  /**
   *
   * @param {object} tokenGroups
   * @returns {array} sorted list of all the indexes of each token in tokenGroups
   */
  getAllIndexes(tokenGroups) {
    let mergedIndexes = [];
    for (const tokenType of Object.keys(tokenGroups)) {
      const indexes = tokenGroups[tokenType].indexes;
      mergedIndexes = [...mergedIndexes, ...indexes];
    }
    return [...mergedIndexes].sort();
  }

  /**
   *
   * @param {string} tokenType
   * @param {TokenGroup} tokenGroup
   * @returns {object} node The first token that is unalphabetized
   */
  findUnalphabetizedToken(tokenGroup) {
    return tokenGroup.items[tokenGroup.unalphabetizedItemIndex];
  }

  /**
   *
   * @param {object} tokenGroup
   * @returns {array} sorted list of all the indexes of each token in tokenGroups
   */
  findUnorderedToken(tokenGroup) {
    return tokenGroup.items.find(
      (item) => this.calculateAttributeIndex(item) === tokenGroup.lastIndex
    );
  }

  capitalizedAttribute(string) {
    return string[0].toUpperCase() + string.slice(1, -1);
  }

  createNotAlphabetizedErrorMessage(tokenType, source) {
    return `${this.capitalizedAttribute(tokenType)} ${source} is not alphabetized`;
  }

  createUnorderedErrorMessage(tokenGroups, tokenType, source) {
    const order = this.getOrder(tokenGroups, tokenType);
    if (order === 0) {
      const otherAttributes = `${this.getAppliedOrder(tokenGroups)[1]} and ${
        this.getAppliedOrder(tokenGroups)[2]
      }`;

      return `${this.capitalizedAttribute(tokenType)} ${source} must go before ${otherAttributes}`;
    }
    if (order === 1) {
      return `${this.capitalizedAttribute(tokenType)} ${source} must go after ${
        this.config.order[order - 1]
      }`;
    }
    return `${this.capitalizedAttribute(tokenType)} ${source} must go after ${
      this.getAppliedOrder(tokenGroups)[order - 1]
    }`;
  }

  /**
   *
   * There are four possible types of attributes.
   *
   * A given tokenType in the first position is unordered if the lastIndex
   * greater than the lastIndex of all of the other attributes.
   *
   * A given tokenType in the third position is unordered if the lastIndex is
   * less than the lastIndex of the tokenType in the second position.
   *
   * A given tokenType in the fourth position is unordered if the lastIndex is
   * less than than the lastIndex of the tokenType in the third position.
   *
   * @param {TokenGroup} tokenGroups
   * @param {string} tokenType
   * @returns {boolean} true if the type of attribute is out of order according to the `order`
   */
  isAttributeUnordered(tokenGroups, tokenType) {
    const order = this.getOrder(tokenGroups, tokenType);
    if (!tokenGroups[tokenType].exists) {
      return false;
    }
    if (this.areSplattributesSurrounded(tokenGroups)) {
      return false;
    }

    switch (order) {
      case 0: {
        return (
          tokenGroups[tokenType].lastIndex >
            tokenGroups[this.getAppliedOrder(tokenGroups)[1]].firstIndex ||
          tokenGroups[tokenType].lastIndex >
            tokenGroups[this.getAppliedOrder(tokenGroups)[2]].firstIndex ||
          tokenGroups[tokenType].lastIndex >
            tokenGroups[this.getAppliedOrder(tokenGroups)[3]].firstIndex
        );
      }

      case 1: {
        return (
          tokenGroups[tokenType].lastIndex <
            tokenGroups[this.getAppliedOrder(tokenGroups)[0]].firstIndex ||
          tokenGroups[tokenType].lastIndex >
            tokenGroups[this.getAppliedOrder(tokenGroups)[2]].firstIndex
        );
      }

      case 2: {
        return (
          tokenGroups[tokenType].lastIndex <
            tokenGroups[this.getAppliedOrder(tokenGroups)[1]].lastIndex ||
          tokenGroups[tokenType].lastIndex >
            tokenGroups[this.getAppliedOrder(tokenGroups)[3]].lastIndex
        );
      }

      case 3: {
        return (
          tokenGroups[tokenType].lastIndex <
          tokenGroups[this.getAppliedOrder(tokenGroups)[2]].lastIndex
        );
      }

      default: {
        break;
      }
    }
  }

  /**
   *
   * Check if mustacheStatement requires alphabetization of tokens.
   * A mustacheStatement only contains tokens thus it can only be unordered if it's tokens are not alphabetized.
   * Fix if possible.
   *
   * @param {object} node
   * @returns void
   */
  checkMustacheAttributesOrder(node) {
    if (!this.sourceForNode(node)) {
      return;
    }
    const tokenGroups = this.makeTokenGroups(
      this.groupTokens(this.getMustacheStatementTokens(node, this.sourceForNode(node)))
    );
    const tokenGroup = tokenGroups[TokenType.ATTRIBUTES];
    if (this.config.alphabetize && tokenGroup.unalphabetizedItemIndex >= 0) {
      const item = this.findUnalphabetizedToken(tokenGroup);

      if (this.mode === 'fix') {
        node.hash.pairs.sort((a, b) => (a.key > b.key ? 1 : -1));
      } else {
        this.log({
          message: this.createNotAlphabetizedErrorMessage(
            TokenType.ATTRIBUTES,
            this.sourceForNode(item)
          ),
          isFixable: true,
          node: item,
        });
      }
    }
  }

  /**
   *
   * Check if elementNode requires alphabetization or ordering of tokens.
   * Fix if possible.
   *
   * @param {object} node
   * @param {object} object with keys parentNode and parentKey
   * @returns void
   */
  checkElementAttributesOrder(node, { parentNode, parentKey }) {
    if (!this.sourceForNode(node)) {
      return;
    }
    const tokenGroups = this.makeTokenGroups(
      this.groupTokens(this.getElementNodeTokens(node, this.sourceForNode(node)))
    );

    for (const tokenType of this.config.order) {
      const isAttributeUnordered = this.isAttributeUnordered(tokenGroups, tokenType);
      if (
        this.config.alphabetize &&
        tokenGroups[tokenType].unalphabetizedItemIndex >= 0 &&
        !this.areSplattributesSurrounded(tokenGroups)
      ) {
        this.alphabetizeAttribute({ tokenType, tokenGroups, node, parentNode, parentKey });
      }

      if (isAttributeUnordered) {
        this.orderAttribute({ tokenType, tokenGroups, node, parentNode, parentKey });
      }
    }
  }

  /**
   *
   * Replace existing elementNode with a new elementNode.
   * Within each attribute type, alphabetize the name or path (for modifiers)
   * before making the elementNode.
   * Attrs consist of a grouping of arguments, attributes and splattributes.
   * Modifiers only consist of modifiers.
   *
   * @param {object} Data structure of the relevant node parts required to alphabetize all of the attribute tokens alphabetically
   */
  alphabetizeAttribute({ tokenType, tokenGroups, node, parentNode, parentKey }) {
    const nodeType = this.getTokenCategory(tokenType);
    const item = this.findUnalphabetizedToken(tokenGroups[tokenType]);
    if (this.mode === 'fix') {
      let newNode;
      if (nodeType === TokenType.MODIFIERS || nodeType === TokenType.COMMENTS) {
        newNode = b.element(node.tag, {
          attrs: node[TokenType.ATTRIBUTES],
          modifiers: node[nodeType]
            .sort((a, b) => (a.path.original > b.path.original ? 1 : -1))
            .map((node) => b.elementModifier(b.path(node.path), node.params, node.hash)),
          children: node.children,
          blockParams: node.blockParams,
          comments: node.comments,
        });
        newNode.selfClosing = node.selfClosing;
      } else if (nodeType !== TokenType.MODIFIERS) {
        const attrs = node[nodeType]
          .sort((a, b) => {
            if (a.name === '...attributes') {
              return this.getOrder(tokenGroups, TokenType.SPLATTRIBUTES) === 3 ? 1 : -1;
            } else if (a.name > b.name) {
              return 1;
            } else {
              return -1;
            }
          })
          .map((attr) => b.attr(attr.name, attr.value));
        newNode = b.element(node.tag, {
          attrs,
          modifiers: node[TokenType.MODIFIERS],
          children: node.children,
          blockParams: node.blockParams,
          comments: node.comments,
        });
        newNode.selfClosing = node.selfClosing;
      }
      replaceNode(node, parentNode, parentKey, newNode);
    } else {
      this.log({
        message: this.createNotAlphabetizedErrorMessage(tokenType, this.sourceForNode(item)),
        isFixable: true,
        node: item,
      });
    }
  }

  // Mutates sorted. Loop through comments in sorted array of tokens and move to
  // the same position relative to the next token in original order.
  orderComment({ node, sorted, tokenGroups }) {
    const reverseComments = node[TokenType.COMMENTS].sort((a, b) => {
      return this.calculateAttributeIndex(b) - this.calculateAttributeIndex(a);
    });

    for (const comment of reverseComments) {
      const token = this.getNode(tokenGroups, comment);
      const fromIndex = this.getAllIndexes(tokenGroups).indexOf(
        this.calculateAttributeIndex(token)
      );
      const fromPosInSorted = sorted.findIndex(
        (node) => this.calculateAttributeIndex(node) === this.getAllIndexes(tokenGroups)[fromIndex]
      );
      let toPosInSorted = sorted.findIndex((node) => {
        // indexOfNext will be undefined for trailing comments
        const indexOfNext = this.getAllIndexes(tokenGroups)[fromIndex + 1];
        return indexOfNext && this.calculateAttributeIndex(node) === indexOfNext;
      });
      if (toPosInSorted < 0) {
        toPosInSorted = sorted.length;
      }
      if (fromPosInSorted !== toPosInSorted) {
        const [spliced] = sorted.splice(fromPosInSorted, 1);
        sorted.splice(toPosInSorted - 1, 0, spliced);
      }
    }
  }

  /**
   *
   * Replace existing elementNode with a new elementNode with ordered tokens.
   * Order types of tokens according to the configurable `order`.
   *
   * The ordering strategy involves sorting all of the tokens by the `order` for it's tokenType.
   * If the `order` is the same, then the tokens should be left in the same order as before.
   * When creating the tokens, start with element's initial loc and add the length of each new token.
   * Multi-line elements are thus flattened to single line elements.
   *
   * @param {object} Data structure of the relevant node parts required to alphabetize all of the tokens alphabetically
   */
  orderAttribute({ tokenType, tokenGroups, node, parentNode, parentKey }) {
    const item = this.findUnorderedToken(tokenGroups[tokenType]);

    if (this.mode === 'fix') {
      const attributesModifiers = [
        ...node[TokenType.ATTRIBUTES],
        ...node[TokenType.MODIFIERS],
        ...node[TokenType.COMMENTS],
      ];

      const sorted = attributesModifiers.sort((a, b) => {
        const orderA = this.getOrder(tokenGroups, this.getTokenType(a));
        const orderB = this.getOrder(tokenGroups, this.getTokenType(b));
        if (orderA === orderB) {
          if (a.loc && b.loc) {
            return this.calculateAttributeIndex(a) > this.calculateAttributeIndex(b);
          }
        }
        return orderA > orderB ? 1 : -1;
      });
      this.orderComment({ node, sorted, tokenGroups });

      const minColumn = node.tag.length + 2;
      const { attributes, modifiers, comments } = sorted.reduce((acc, currAttr) => {
        const nodeType = this.getTokenCategory(this.getTokenType(currAttr));
        if (!acc[nodeType]) {
          acc[nodeType] = [];
        }
        const line = node.loc.start.line;
        const startColumn = acc.cursor || minColumn;
        const endColumn = startColumn + currAttr.loc.end.column - currAttr.loc.start.column;
        const loc = b.loc(line, startColumn, line, endColumn);
        const newAttribute = this.makeToken({ nodeType, node: currAttr, loc });
        if (newAttribute.type === 'AttrNode') {
          newAttribute.isValueless = currAttr.isValueless;
          newAttribute.quoteType = currAttr.quoteType;
        }
        acc[nodeType].push(newAttribute);
        acc.cursor = endColumn + 1;
        return acc;
      }, {});

      const newNode = b.element(node.tag, {
        attrs: attributes,
        modifiers,
        children: node.children,
        blockParams: node.blockParams,
        comments,
      });
      newNode.selfClosing = node.selfClosing;

      replaceNode(node, parentNode, parentKey, newNode);
    } else {
      this.log({
        message: this.createUnorderedErrorMessage(tokenGroups, tokenType, this.sourceForNode(item)),
        isFixable: true,
        node: item,
      });
    }
  }

  visitor() {
    return {
      MustacheStatement(node) {
        this.checkMustacheAttributesOrder(node);
      },
      ElementNode(node, { parentNode, parentKey }) {
        this.checkElementAttributesOrder(node, { parentNode, parentKey });
      },
    };
  }
}

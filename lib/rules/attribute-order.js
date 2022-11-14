import { builders as b } from 'ember-template-recast';

import createErrorMessage from '../helpers/create-error-message.js';
import isValidConfigObjectFormat from '../helpers/is-valid-config-object.js';
import replaceNode from '../helpers/replace-node.js';
import Rule from './_base.js';

const ERROR_MESSAGE = 'Your config does not match the allowed values';

const AttributeType = {
  ARGUMENTS: 'arguments',
  ATTRIBUTES: 'attributes',
  MODIFIERS: 'modifiers',
  SPLATTRIBUTES: 'splattributes',
  COMMENTS: 'comments',
};

const DEFAULT_CONFIG = {
  alphabetize: true,
  order: [AttributeType.ARGUMENTS, AttributeType.ATTRIBUTES, AttributeType.MODIFIERS],
};

export function createAttributesOrderErrorMessage(config) {
  return createErrorMessage('attribute-order', ERROR_MESSAGE, config);
}

// Class representing all of attribute tokens of a given attributeType for a node
class AttributeGroup {
  _items;

  constructor(items) {
    this._items = items;
  }

  get items() {
    return this._items;
  }

  get exists() {
    return this.items.length > 0;
  }

  get indexes() {
    return this.items.map((attr) => attr.loc.start.line * attr.loc.start.column);
  }

  get lastIndex() {
    return this.indexes.length ? Math.max(...this.indexes) : undefined;
  }

  get firstIndex() {
    return this.indexes.length ? Math.min(...this.indexes) : undefined;
  }

  unalphabetizedItemIndex(context) {
    const alpha = this.items.map((attr) => {
      return context.sourceForNode(attr).match(/([^A-Za-z]*)([\w-]*)/)[2];
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
        ![AttributeType.ARGUMENTS, AttributeType.ATTRIBUTES, AttributeType.MODIFIERS].every(
          (attribute) => config.order.includes(attribute)
        )
      ) {
        throw new Error(errorMessage);
      }
      return { ...DEFAULT_CONFIG, ...config };
    }

    return DEFAULT_CONFIG;
  }

  areSplattributesSurrounded(attributeGroups) {
    const splattributeLastIndex = attributeGroups[AttributeType.SPLATTRIBUTES].lastIndex;
    if (splattributeLastIndex < 0) {
      return false;
    }
    const maxIndex = Math.max(
      ...Object.values(attributeGroups).map(
        (attributeGroup) => attributeGroup.lastIndex || Number.NEGATIVE_INFINITY
      )
    );
    const minIndex = Math.min(
      ...Object.values(attributeGroups).map(
        (attributeGroup) => attributeGroup.firstIndex || Number.POSITIVE_INFINITY
      )
    );
    return splattributeLastIndex > minIndex && splattributeLastIndex < maxIndex;
  }

  calculateAttributeIndex(attr) {
    return attr.loc.start.line * attr.loc.start.column;
  }

  /**
   *
   * @param {object} attributeGroups
   * @returns {array} The order of attributes given a particular node
   * If splattributes are in the first or last position they should remain in that order
   */
  getAppliedOrder(attributeGroups) {
    if (this.appliedOrder) {
      return this.appliedOrder;
    }
    const maxLastIndex = Math.max(
      ...Object.values(attributeGroups)
        .map((attributeGroup) => attributeGroup.lastIndex)
        .filter((i) => Number.isInteger(i))
    );
    const minLastIndex = Math.min(
      ...Object.values(attributeGroups)
        .map((attributeGroup) => attributeGroup.lastIndex)
        .filter((i) => Number.isInteger(i))
    );

    const orderMinusSplattributes = [
      ...this.config.order.filter((attribute) => attribute !== AttributeType.SPLATTRIBUTES),
    ];

    const splattributeLastIndex = attributeGroups[AttributeType.SPLATTRIBUTES]
      ? attributeGroups[AttributeType.SPLATTRIBUTES].lastIndex
      : undefined;
    const attributeLastIndex = attributeGroups[AttributeType.ATTRIBUTES]
      ? attributeGroups[AttributeType.ATTRIBUTES].lastIndex
      : undefined;

    if (
      splattributeLastIndex === maxLastIndex ||
      (splattributeLastIndex && splattributeLastIndex > attributeLastIndex)
    ) {
      this.appliedOrder = [...orderMinusSplattributes, AttributeType.SPLATTRIBUTES];
    } else if (
      splattributeLastIndex === minLastIndex ||
      (splattributeLastIndex && splattributeLastIndex < attributeLastIndex)
    ) {
      this.appliedOrder = [AttributeType.SPLATTRIBUTES, ...orderMinusSplattributes];
    } else {
      this.appliedOrder = [...orderMinusSplattributes, AttributeType.SPLATTRIBUTES];
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
      keys.push([AttributeType.ATTRIBUTES, attr]);
    }
    return keys;
  }

  getElementNodeTokens(node) {
    const keys = [];
    for (const attr of node.attributes) {
      const type = this.getAttributeType(attr);
      keys.push([type, attr]);
    }
    for (const modifier of node.modifiers) {
      keys.push([AttributeType.MODIFIERS, modifier]);
    }
    for (const comment of node.comments) {
      keys.push([AttributeType.COMMENTS, comment]);
    }
    return keys;
  }

  /**
   *
   * @param {string} attributeType
   * @returns {string} Categorical type (either attributes or modifiers) of the attribute.
   * Arguments, attributes and splattributes are considered attributes.
   */
  getTokenType(attributeType) {
    return [
      AttributeType.ARGUMENTS,
      AttributeType.ATTRIBUTES,
      AttributeType.SPLATTRIBUTES,
    ].includes(attributeType)
      ? AttributeType.ATTRIBUTES
      : attributeType;
  }

  /**
   *
   * @param {object} attr
   * @returns The specific type of attribute (arguments, splattributes, attributes or modifiers) which can be ordered.
   */
  getAttributeType(attr) {
    if (attr.type && attr.type.includes('Comment')) {
      return AttributeType.COMMENTS;
    }
    if (!attr.name) {
      return AttributeType.MODIFIERS;
    }
    return attr.name.startsWith('@')
      ? AttributeType.ARGUMENTS
      : attr.name.startsWith('...')
      ? AttributeType.SPLATTRIBUTES
      : AttributeType.ATTRIBUTES;
  }

  getAttribute(attributeGroups, { type, name, value }) {
    for (const attributeGroup of Object.values(attributeGroups)) {
      const items = attributeGroup.items;
      for (const node of items) {
        if (node.type === type && ((node.name && node.name === name) || node.value === value)) {
          return node;
        }
      }
    }
  }

  makeAttribute({ nodeType, attr, loc }) {
    switch (nodeType) {
      case AttributeType.MODIFIERS:
        return b.elementModifier(b.path(attr.path), attr.params, attr.hash, loc);

      case AttributeType.COMMENTS:
        return attr.type === 'MustacheCommentStatement'
          ? b.mustacheComment(attr.value, loc)
          : b.comment(attr.value, loc);

      default:
        return b.attr(attr.name, attr.value, loc);
    }
  }

  groupTokens(tokens) {
    const result = Object.values(AttributeType).reduce((acc, attributeType) => {
      acc[attributeType] = [];
      return acc;
    }, {});
    for (let [attributeType, node] of tokens) {
      result[attributeType].push(node);
    }
    return result;
  }

  makeAttributeGroups(tokens) {
    const attributeGroups = {};
    for (const attributeType of Object.keys(tokens)) {
      attributeGroups[attributeType] = new AttributeGroup(tokens[attributeType]);
    }
    return attributeGroups;
  }

  getAllIndexes(attributeGroups) {
    let mergedIndexes = [];
    for (const attributeType of Object.keys(attributeGroups)) {
      const indexes = attributeGroups[attributeType].indexes;
      mergedIndexes = [...(mergedIndexes || []), ...indexes];
      mergedIndexes = [...new Set(mergedIndexes)].sort();
    }
    return mergedIndexes;
  }

  findUnalphabetizedElement(attributeType, attributeGroups) {
    return attributeGroups[attributeType].items[
      attributeGroups[attributeType].unalphabetizedItemIndex(this)
    ];
  }

  findCurrentElement(attributeType, attributeGroups) {
    return attributeGroups[attributeType].items.find(
      (item) => this.calculateAttributeIndex(item) === attributeGroups[attributeType].lastIndex
    );
  }

  capitalizedAttribute(string) {
    return string[0].toUpperCase() + string.slice(1, -1);
  }

  createNotAlphabetizedErrorMessage(attributeType, source) {
    return `${this.capitalizedAttribute(attributeType)} ${source} is not alphabetized`;
  }

  createUnorderedErrorMessage(attributeGroups, attributeType, source) {
    const order = this.getOrder(attributeGroups, attributeType);
    if (order === 0) {
      const otherAttributes = `${this.getAppliedOrder(attributeGroups)[1]} and ${
        this.getAppliedOrder(attributeGroups)[2]
      }`;

      return `${this.capitalizedAttribute(
        attributeType
      )} ${source} must go before ${otherAttributes}`;
    }
    if (order === 1) {
      return `${this.capitalizedAttribute(attributeType)} ${source} must go after ${
        this.config.order[order - 1]
      }`;
    }
    return `${this.capitalizedAttribute(attributeType)} ${source} must go after ${
      this.getAppliedOrder(attributeGroups)[order - 1]
    }`;
  }

  /**
   *
   * There are four possible types of attributes.
   *
   * A given attributeType in the first position is unordered if the lastIndex
   * greater than the lastIndex of all of the other attributes.
   *
   * A given attributeType in the third position is unordered if the lastIndex is
   * less than the lastIndex of the attributeType in the second position.
   *
   * A given attributeType in the fourth position is unordered if the lastIndex is
   * less than than the lastIndex of the attributeType in the third position.
   *
   * @param {AttributeGroup} attributeGroups
   * @param {string} attributeType
   * @returns {boolean} true if the type of attribute is out of order according to the `order`
   */
  isAttributeUnordered(attributeGroups, attributeType) {
    const order = this.getOrder(attributeGroups, attributeType);
    if (!attributeGroups[attributeType].exists) {
      return false;
    }
    if (this.areSplattributesSurrounded(attributeGroups)) {
      return false;
    }

    switch (order) {
      case 0:
        return (
          attributeGroups[attributeType].lastIndex >
            attributeGroups[this.getAppliedOrder(attributeGroups)[1]].firstIndex ||
          attributeGroups[attributeType].lastIndex >
            attributeGroups[this.getAppliedOrder(attributeGroups)[2]].firstIndex ||
          attributeGroups[attributeType].lastIndex >
            attributeGroups[this.getAppliedOrder(attributeGroups)[3]].firstIndex
        );

      case 1:
        return (
          attributeGroups[attributeType].lastIndex <
            attributeGroups[this.getAppliedOrder(attributeGroups)[0]].firstIndex ||
          attributeGroups[attributeType].lastIndex >
            attributeGroups[this.getAppliedOrder(attributeGroups)[2]].firstIndex
        );

      case 2:
        return (
          attributeGroups[attributeType].lastIndex <
            attributeGroups[this.getAppliedOrder(attributeGroups)[1]].lastIndex ||
          attributeGroups[attributeType].lastIndex >
            attributeGroups[this.getAppliedOrder(attributeGroups)[3]].lastIndex
        );

      case 3:
        return (
          attributeGroups[attributeType].lastIndex <
          attributeGroups[this.getAppliedOrder(attributeGroups)[2]].lastIndex
        );

      default:
        break;
    }
  }

  getOrder(attributeGroups, attributeType) {
    return this.getAppliedOrder(attributeGroups).indexOf(attributeType);
  }

  /**
   *
   * Check if mustacheStatement requires alphabetization of attributes.
   * A mustacheStatement only contains attributes thus it can only be unordered if it's attributes are not alphabetized.
   * Fix if possible.
   *
   * @param {object} node
   * @returns void
   */
  checkMustacheAttributesOrder(node) {
    if (!this.sourceForNode(node)) {
      return;
    }
    const attributeGroups = this.makeAttributeGroups(
      this.groupTokens(this.getMustacheStatementTokens(node, this.sourceForNode(node)))
    );
    const attributeType = AttributeType.ATTRIBUTES;
    if (
      this.config.alphabetize &&
      attributeGroups[attributeType].unalphabetizedItemIndex(this) >= 0
    ) {
      const item = this.findUnalphabetizedElement(attributeType, attributeGroups);

      if (this.mode === 'fix') {
        node.hash.pairs.sort((a, b) => (a.key > b.key ? 1 : -1));
      } else {
        this.log({
          message: this.createNotAlphabetizedErrorMessage(attributeType, this.sourceForNode(item)),
          isFixable: true,
          node: item,
        });
      }
    }
  }

  /**
   *
   * Check if elementNode requires alphabetization or ordering of attributes.
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
    const attributeGroups = this.makeAttributeGroups(
      this.groupTokens(this.getElementNodeTokens(node, this.sourceForNode(node)))
    );

    for (const attributeType of this.config.order) {
      const isAttributeUnordered = this.isAttributeUnordered(attributeGroups, attributeType);
      if (
        this.config.alphabetize &&
        attributeGroups[attributeType].unalphabetizedItemIndex(this) >= 0 &&
        !this.areSplattributesSurrounded(attributeGroups)
      ) {
        this.alphabetizeAttribute({ attributeType, attributeGroups, node, parentNode, parentKey });
      }

      if (isAttributeUnordered) {
        this.orderAttribute({ attributeType, attributeGroups, node, parentNode, parentKey });
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
  alphabetizeAttribute({ attributeType, attributeGroups, node, parentNode, parentKey }) {
    const nodeType = this.getTokenType(attributeType);
    const item = this.findUnalphabetizedElement(attributeType, attributeGroups);
    if (this.mode === 'fix') {
      let newNode;
      if (nodeType === AttributeType.MODIFIERS || nodeType === AttributeType.COMMENTS) {
        newNode = b.element(node.tag, {
          attrs: node[AttributeType.ATTRIBUTES],
          modifiers: node[nodeType]
            .sort((a, b) => (a.path.original > b.path.original ? 1 : -1))
            .map((attr) => b.elementModifier(b.path(attr.path), attr.params, attr.hash)),
          children: node.children,
          blockParams: node.blockParams,
          comments: node.comments,
        });
        newNode.selfClosing = node.selfClosing;
      } else if (nodeType !== AttributeType.MODIFIERS) {
        const attrs = node[nodeType]
          .sort((a, b) => {
            if (a.name === '...attributes') {
              return this.getOrder(attributeGroups, AttributeType.SPLATTRIBUTES) === 3 ? 1 : -1;
            } else if (a.name > b.name) {
              return 1;
            } else {
              return -1;
            }
          })
          .map((attr) => b.attr(attr.name, attr.value));
        newNode = b.element(node.tag, {
          attrs,
          modifiers: node[AttributeType.MODIFIERS],
          children: node.children,
          blockParams: node.blockParams,
          comments: node.comments,
        });
        newNode.selfClosing = node.selfClosing;
      }
      replaceNode(node, parentNode, parentKey, newNode);
    } else {
      this.log({
        message: this.createNotAlphabetizedErrorMessage(attributeType, this.sourceForNode(item)),
        isFixable: true,
        node: item,
      });
    }
  }

  /**
   *
   * Replace existing elementNode with a new elementNode with ordered attributes.
   * Order types of attributes according to the configurable `order`.
   *
   * The ordering strategy involves sorting all of the tokens by the `order` for it's attributeType.
   * If the `order` is the same, then the tokens should be left in the same order as before.
   * When creating the tokens, start with element's initial loc and add the length of each new token.
   * Multi-line elements are thus flattened to single line elements.
   *
   * @param {object} Data structure of the relevant node parts required to alphabetize all of the attribute tokens alphabetically
   */
  orderAttribute({ attributeType, attributeGroups, node, parentNode, parentKey }) {
    const item = this.findCurrentElement(attributeType, attributeGroups);

    if (this.mode === 'fix') {
      const attributesModifiers = [
        ...node[AttributeType.ATTRIBUTES],
        ...node[AttributeType.MODIFIERS],
      ];

      const sorted = attributesModifiers.sort((a, b) => {
        const orderA = this.getOrder(attributeGroups, this.getAttributeType(a));
        const orderB = this.getOrder(attributeGroups, this.getAttributeType(b));
        if (orderA === orderB) {
          if (a.loc && b.loc) {
            return this.calculateAttributeIndex(a) > this.calculateAttributeIndex(b);
          }
        }
        return orderA > orderB ? 1 : -1;
      });

      // Add comments into sorted array of attributes by inserting it
      // at the same position relative to the next attribute in original order.
      for (const comment of node[AttributeType.COMMENTS]) {
        const token = this.getAttribute(attributeGroups, comment);
        const fromIndex = this.getAllIndexes(attributeGroups).indexOf(
          this.calculateAttributeIndex(token)
        );
        const toIndex = sorted.findIndex((node) => {
          return (
            this.calculateAttributeIndex(node) ===
            this.getAllIndexes(attributeGroups)[fromIndex + 1]
          );
        });
        sorted.splice(toIndex, 0, token);
      }

      const minColumn = node.tag.length + 2;
      const { attributes, modifiers, comments } = sorted.reduce((acc, currAttr) => {
        const nodeType = this.getTokenType(this.getAttributeType(currAttr));
        if (!acc[nodeType]) {
          acc[nodeType] = [];
        }
        const line = node.loc.start.line;
        const startColumn = acc.cursor || minColumn;
        const endColumn = startColumn + currAttr.loc.end.column - currAttr.loc.start.column;
        const loc = b.loc(line, startColumn, line, endColumn);
        const newAttribute = this.makeAttribute({ nodeType, attr: currAttr, loc });
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
        message: this.createUnorderedErrorMessage(
          attributeGroups,
          attributeType,
          this.sourceForNode(item)
        ),
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

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
};

const DEFAULT_CONFIG = {
  alphabetize: true,
  attributeOrder: [AttributeType.ARGUMENTS, AttributeType.ATTRIBUTES, AttributeType.MODIFIERS],
};

export function createAttributesOrderErrorMessage(config) {
  return createErrorMessage('attributes-order', ERROR_MESSAGE, config);
}

export default class AttributesOrder extends Rule {
  parseConfig(config) {
    const errorMessage = createAttributesOrderErrorMessage(config);
    if (!isValidConfigObjectFormat(config, DEFAULT_CONFIG)) {
      throw new Error(errorMessage);
    }

    if (config && typeof config === 'object') {
      return { ...DEFAULT_CONFIG, ...config };
    }

    return DEFAULT_CONFIG;
  }

  areSplattributesSurrounded(nodeTokens) {
    const splattributeLastIndex = nodeTokens[AttributeType.SPLATTRIBUTES].last_index;
    if (splattributeLastIndex < 0) {
      return false;
    }
    const maxLastIndex = Math.max(
      ...Object.values(nodeTokens).map(
        (nodeToken) => nodeToken.last_index || Number.NEGATIVE_INFINITY
      )
    );
    const minLastIndex = Math.min(
      ...Object.values(nodeTokens).map(
        (nodeToken) => nodeToken.last_index || Number.POSITIVE_INFINITY
      )
    );
    return splattributeLastIndex > minLastIndex && splattributeLastIndex < maxLastIndex;
  }

  /**
   *
   * @param {object} nodeTokens
   * @returns {array} The order of attributes given a particular node
   * If splattributes are in the first or last position they should remain in that order
   */
  getAppliedOrder(nodeTokens) {
    const maxLastIndex = Math.max(
      ...Object.values(nodeTokens).map((nodeToken) => nodeToken.last_index)
    );
    const minLastIndex = Math.min(
      ...Object.values(nodeTokens).map((nodeToken) => nodeToken.last_index)
    );

    if (nodeTokens[AttributeType.SPLATTRIBUTES].last_index === maxLastIndex) {
      return [...this.config.attributeOrder, AttributeType.SPLATTRIBUTES];
    } else if (nodeTokens[AttributeType.SPLATTRIBUTES].last_index === minLastIndex) {
      return [AttributeType.SPLATTRIBUTES, ...this.config.attributeOrder];
    }
    return [...this.config.attributeOrder, AttributeType.SPLATTRIBUTES];
  }

  /**
   *
   * @param {object} node
   * @param {string} nodeText
   * @returns {array} All possible tokens.  Mustache statements can only contain attributes.
   */
  getMustacheStatementTokens(node, nodeText) {
    const keys = [];
    for (const attr of node.hash.pairs) {
      const source = this.sourceForNode(attr);
      keys.push([AttributeType.ATTRIBUTES, nodeText.indexOf(source), source, attr]);
    }
    return keys;
  }

  getElementNodeTokens(node, nodeText) {
    const keys = [];
    for (const attr of node.attributes) {
      const source = this.sourceForNode(attr);
      const type = this.getAttributeType(attr);
      keys.push([type, nodeText.indexOf(source), source, attr]);
    }
    for (const modifier of node.modifiers) {
      const source = this.sourceForNode(modifier);
      keys.push([AttributeType.MODIFIERS, nodeText.indexOf(source), source, modifier]);
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
      : AttributeType.MODIFIERS;
  }

  /**
   *
   * @param {object} attr
   * @returns The specific type of attribute (arguments, splattributes, attributes or modifiers) which can be ordered.
   */
  getAttributeType(attr) {
    if (!attr.name) {
      return AttributeType.MODIFIERS;
    }
    return attr.name.startsWith('@')
      ? AttributeType.ARGUMENTS
      : attr.name.startsWith('...')
      ? AttributeType.SPLATTRIBUTES
      : AttributeType.ATTRIBUTES;
  }

  groupTokens(tokens) {
    const result = Object.values(AttributeType).reduce((acc, attributeType) => {
      acc[attributeType] = [];
      return acc;
    }, {});
    for (let [name, index, source, node] of tokens) {
      result[name].push([index, source, node]);
    }
    return result;
  }

  addMetadata(tokens) {
    for (const tokenName of Object.keys(tokens)) {
      // index is product of line * column
      // eslint-disable-next-line no-unused-vars
      const indexes = tokens[tokenName].map(([a, b, { loc }]) => loc.start.line * loc.start.column);
      const alpha = tokens[tokenName].map(([, name]) => name.match(/([^A-Za-z]*)([\w-]*)/)[2]);
      tokens[tokenName] = {
        items: tokens[tokenName],
        exists: tokens[tokenName].length !== 0,
        last_index: indexes.length ? Math.max(...indexes) : undefined,
        first_index: indexes.length ? Math.min(...indexes) : undefined,
        unalphabetized_item_pos: alpha.findIndex((e, idx) => idx > 0 && e < alpha[idx - 1]),
      };
    }
    return tokens;
  }

  findUnalphabetizedElement(attributeType, nodeTokens) {
    return nodeTokens[attributeType].items[nodeTokens[attributeType].unalphabetized_item_pos];
  }

  findCurrentElement(attributeType, nodeTokens) {
    return nodeTokens[attributeType].items.find(
      // eslint-disable-next-line no-unused-vars
      ([index, source, item]) =>
        item.loc.start.line * item.loc.start.column === nodeTokens[attributeType].last_index
    );
  }

  capitalizedAttribute(string) {
    return string[0].toUpperCase() + string.slice(1, -1);
  }

  createNotAlphabetizedErrorMessage(attributeType, source) {
    return `${this.capitalizedAttribute(attributeType)} ${source} is not alphabetized`;
  }

  createUnorderedErrorMessage(nodeTokens, attributeType, source) {
    const attributeOrder = this.getOrder(nodeTokens, attributeType);
    if (attributeOrder === 0) {
      const otherAttributes = `${this.getAppliedOrder(nodeTokens)[1]}, ${
        this.getAppliedOrder(nodeTokens)[2]
      } and ${this.getAppliedOrder(nodeTokens)[3]}`;

      return `${this.capitalizedAttribute(
        attributeType
      )} ${source} must go before ${otherAttributes}`;
    }
    if (attributeOrder === 1 || attributeOrder === 2) {
      return `${this.capitalizedAttribute(attributeType)} ${source} must go after ${
        this.config.attributeOrder[attributeOrder - 1]
      } and before ${this.config.attributeOrder[attributeOrder + 1]}
            `;
    }
    return `${this.capitalizedAttribute(attributeType)} ${source} must go after ${
      this.getAppliedOrder(nodeTokens)[attributeOrder - 1]
    }`;
  }

  /**
   *
   * There are four possible types of attributes.
   *
   * A given attributeType in the first position is unordered if the last_index
   * greater than the last_index of all of the other attributes.
   *
   * A given attributeType in the third position is unordered if the last_index is
   * less than the last_index of the attributeType in the second position.
   *
   * A given attributeType in the fourth position is unordered if the last_index is
   * less than than the last_index of the attributeType in the third position.
   *
   * @param {object} nodeTokens
   * @param {string} attributeType
   * @returns {boolean} true if the type of attribute is out of order according to the attributeOrder
   */
  isAttributeUnordered(nodeTokens, attributeType) {
    const attributeOrder = this.getOrder(nodeTokens, attributeType);
    if (!nodeTokens[attributeType].exists) {
      return false;
    }
    if (this.areSplattributesSurrounded(nodeTokens)) {
      return false;
    }

    switch (attributeOrder) {
      case 0:
        return (
          nodeTokens[attributeType].last_index >
            nodeTokens[this.getAppliedOrder(nodeTokens)[1]].first_index ||
          nodeTokens[attributeType].last_index >
            nodeTokens[this.getAppliedOrder(nodeTokens)[2]].first_index ||
          nodeTokens[attributeType].last_index >
            nodeTokens[this.getAppliedOrder(nodeTokens)[3]].first_index
        );

      case 1:
        return (
          nodeTokens[attributeType].last_index <
            nodeTokens[this.getAppliedOrder(nodeTokens)[0]].first_index ||
          nodeTokens[attributeType].last_index >
            nodeTokens[this.getAppliedOrder(nodeTokens)[2]].first_index
        );

      case 2:
        return (
          nodeTokens[attributeType].last_index <
            nodeTokens[this.getAppliedOrder(nodeTokens)[1]].last_index ||
          nodeTokens[attributeType].last_index >
            nodeTokens[this.getAppliedOrder(nodeTokens)[3]].last_index
        );

      case 3:
        return (
          nodeTokens[attributeType].last_index <
          nodeTokens[this.getAppliedOrder(nodeTokens)[2]].last_index
        );

      default:
        break;
    }
  }

  getOrder(nodeTokens, attributeType) {
    return this.getAppliedOrder(nodeTokens).indexOf(attributeType);
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
    const nodeTokens = this.addMetadata(
      this.groupTokens(this.getMustacheStatementTokens(node, this.sourceForNode(node)))
    );
    const attributeType = AttributeType.ATTRIBUTES;
    if (this.config.alphabetize && nodeTokens[attributeType].unalphabetized_item_pos >= 0) {
      const [, source, item] = this.findUnalphabetizedElement(attributeType, nodeTokens);

      if (this.mode === 'fix') {
        node.hash.pairs.sort((a, b) => (a.key > b.key ? 1 : -1));
      } else {
        this.log({
          message: this.createNotAlphabetizedErrorMessage(attributeType, source),
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
    const nodeTokens = this.addMetadata(
      this.groupTokens(this.getElementNodeTokens(node, this.sourceForNode(node)))
    );

    for (const attributeType of this.config.attributeOrder) {
      if (this.config.alphabetize && nodeTokens[attributeType].unalphabetized_item_pos >= 0) {
        this.alphabetizeAttribute({ attributeType, nodeTokens, node, parentNode, parentKey });
      }

      if (this.isAttributeUnordered(nodeTokens, attributeType)) {
        this.orderAttribute({ attributeType, nodeTokens, node, parentNode, parentKey });
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
  alphabetizeAttribute({ attributeType, nodeTokens, node, parentNode, parentKey }) {
    const nodeType = this.getTokenType(attributeType);
    const [, source, item] = this.findUnalphabetizedElement(attributeType, nodeTokens);
    if (this.mode === 'fix') {
      let newNode;
      if (nodeType !== AttributeType.MODIFIERS) {
        const attrs = node[nodeType]
          .sort((a, b) => (a.name > b.name ? 1 : -1))
          .map((attr) => b.attr(attr.name, attr.value));
        newNode = b.element(node.tag, {
          attrs,
          modifiers: node[AttributeType.MODIFIERS],
          children: node.children,
          blockParams: node.blockParams,
          comments: node.comments,
        });
        newNode.selfClosing = node.selfClosing;
      } else {
        newNode = b.element(node.tag, {
          attrs: node[AttributeType.ATTRIBUTES],
          modifiers: node[nodeType]
            .sort((a, b) => (a.path.original > b.path.original ? 1 : -1))
            .map(({ path, params }) => b.elementModifier(b.path(path), params)),
          children: node.children,
          blockParams: node.blockParams,
          comments: node.comments,
        });
        newNode.selfClosing = node.selfClosing;
      }
      replaceNode(node, parentNode, parentKey, newNode);
    } else {
      this.log({
        message: this.createNotAlphabetizedErrorMessage(attributeType, source),
        isFixable: true,
        node: item,
      });
    }
  }

  /**
   *
   * Replace existing elementNode with a new elementNode with ordered attributes.
   * Order types of attributes according to the configurable attributeOrder.
   *
   * The ordering strategy involves sorting all of the tokens by the attributeOrder.
   * If the attributeOrder is the same, then the tokens should be left in the same order as before.
   * When creating the tokens, start with element's initial loc and add the length of each new token.
   * Multi-line elements are thus flattened to single line elements.
   *
   * @param {object} Data structure of the relevant node parts required to alphabetize all of the attribute tokens alphabetically
   */
  orderAttribute({ attributeType, nodeTokens, node, parentNode, parentKey }) {
    const [, source, item] = this.findCurrentElement(attributeType, nodeTokens);

    if (this.mode === 'fix') {
      const attributesAndModifiers = [
        ...node[AttributeType.ATTRIBUTES],
        ...node[AttributeType.MODIFIERS],
      ];
      const sorted = attributesAndModifiers.sort((a, b) => {
        const orderA = this.getOrder(nodeTokens, this.getAttributeType(a));
        const orderB = this.getOrder(nodeTokens, this.getAttributeType(b));
        if (orderA === orderB) {
          return a.loc?.start.line * a.loc?.start.column > b.loc?.start.line * b.loc?.start.column;
        }
        return orderA > orderB ? 1 : -1;
      });

      const minColumn = node.tag.length + 2;
      const { attributes, modifiers } = sorted.reduce((acc, attr) => {
        const nodeType = this.getTokenType(this.getAttributeType(attr));
        if (!acc[nodeType]) {
          acc[nodeType] = [];
        }
        const line = node.loc.start.line;
        const startColumn = acc.cursor || minColumn;
        const endColumn = startColumn + attr.loc.end.column - attr.loc.start.column;
        const loc = b.loc(line, startColumn, line, endColumn);
        const newAttribute =
          nodeType !== AttributeType.MODIFIERS
            ? b.attr(attr.name, attr.value, loc)
            : b.elementModifier(b.path(attr.path), attr.params, attr.hash, loc);
        acc[nodeType].push(newAttribute);
        acc.cursor = endColumn + 1;
        return acc;
      }, {});
      const newNode = b.element(node.tag, {
        attrs: attributes,
        modifiers,
        children: node.children,
        blockParams: node.blockParams,
        comments: node.comments,
      });
      newNode.selfClosing = node.selfClosing;

      replaceNode(node, parentNode, parentKey, newNode);
    } else {
      this.log({
        message: this.createUnorderedErrorMessage(nodeTokens, attributeType, source),
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

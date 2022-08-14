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
  attributeOrder: [
    AttributeType.ARGUMENTS,
    AttributeType.ATTRIBUTES,
    AttributeType.MODIFIERS,
    AttributeType.SPLATTRIBUTES,
  ],
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

  getMustacheTokens(node, nodeText) {
    const keys = [];
    for (const attr of node.hash.pairs) {
      const source = this.sourceForNode(attr);
      keys.push([AttributeType.ATTRIBUTES, nodeText.indexOf(source), source, attr]);
    }
    return keys;
  }

  getNodeType(attributeType) {
    return [
      AttributeType.ARGUMENTS,
      AttributeType.ATTRIBUTES,
      AttributeType.SPLATTRIBUTES,
    ].includes(attributeType)
      ? AttributeType.ATTRIBUTES
      : AttributeType.MODIFIERS;
  }

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

  getTokens(node, nodeText) {
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
      // eslint-disable-next-line no-unused-vars
      const indexes = tokens[tokenName].map(([a, b, { loc }]) => loc.start.column);
      const alpha = tokens[tokenName].map(([, name]) => name.match(/([^A-Za-z]*)([\w-]*)/)[2]);
      tokens[tokenName] = {
        items: tokens[tokenName],
        exists: tokens[tokenName].length !== 0,
        last_index: Math.max(...indexes),
        first_index: Math.min(...indexes),
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
      ([index]) => index === nodeTokens[attributeType].last_index
    );
  }

  capitalizedAttribute(string) {
    return string[0].toUpperCase() + string.slice(1, -1);
  }

  createNotAlphabetizedErrorMessage(attributeType, source) {
    return `${this.capitalizedAttribute(attributeType)} ${source} is not alphabetized`;
  }

  createUnorderedErrorMessage(attributeType, source) {
    const attributeOrder = this.getOrder(attributeType);
    if (attributeOrder === 0) {
      const otherAttributes = `${this.config.attributeOrder[1]}, ${this.config.attributeOrder[2]} and ${this.config.attributeOrder[3]}`;

      return `${this.capitalizedAttribute(
        attributeType
      )} ${source} must go before ${otherAttributes}`;
    }
    return `${this.capitalizedAttribute(attributeType)} ${source} must go after ${
      this.config.attributeOrder[attributeOrder - 1]
    }`;
  }

  isAttributeUnordered(attributeType, nodeTokens) {
    if (!nodeTokens[attributeType].exists) {
      return false;
    }
    const attributeOrder = this.getOrder(attributeType);
    const hasAttributesAfterSplattributes =
      nodeTokens[AttributeType.SPLATTRIBUTES].exists &&
      nodeTokens[AttributeType.SPLATTRIBUTES].last_index <
        nodeTokens[AttributeType.ATTRIBUTES].last_index;

    switch (attributeOrder) {
      case 0:
        return (
          nodeTokens[attributeType].last_index >
            nodeTokens[this.config.attributeOrder[1]].first_index ||
          nodeTokens[attributeType].last_index >
            nodeTokens[this.config.attributeOrder[2]].first_index ||
          nodeTokens[attributeType].last_index >
            nodeTokens[this.config.attributeOrder[3]].first_index
        );

      case 2:
        if (attributeType !== AttributeType.MODIFIERS || !hasAttributesAfterSplattributes) {
          return (
            nodeTokens[attributeType].last_index <
            nodeTokens[this.config.attributeOrder[1]].last_index
          );
        }
        break;

      case 3:
        if (attributeType !== AttributeType.MODIFIERS || !hasAttributesAfterSplattributes) {
          return (
            nodeTokens[attributeType].last_index <
            nodeTokens[this.config.attributeOrder[2]].last_index
          );
        }
        break;

      default:
        break;
    }
  }

  checkMustacheAttributesOrder(node) {
    if (!this.sourceForNode(node)) {
      return;
    }
    const nodeTokens = this.addMetadata(
      this.groupTokens(this.getMustacheTokens(node, this.sourceForNode(node)))
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
          source,
          node: item,
        });
      }
    }
  }

  getOrder(attributeType) {
    return this.config.attributeOrder.indexOf(attributeType);
  }

  checkElementAttributesOrder(node, { parentNode, parentKey }) {
    if (!this.sourceForNode(node)) {
      return;
    }
    const nodeTokens = this.addMetadata(
      this.groupTokens(this.getTokens(node, this.sourceForNode(node)))
    );

    for (const attributeType of this.config.attributeOrder) {
      if (this.config.alphabetize && nodeTokens[attributeType].unalphabetized_item_pos >= 0) {
        const nodeType = this.getNodeType(attributeType);
        const [, source, item] = this.findUnalphabetizedElement(attributeType, nodeTokens);
        if (this.mode === 'fix') {
          let newNode;
          if (nodeType !== AttributeType.MODIFIERS) {
            newNode = b.element(node.tag, {
              attrs: node[nodeType]
                .sort((a, b) => (a.key > b.key ? 1 : -1))
                .map((attr) => b.attr(attr.name, attr.value)),
              modifiers: [...node[AttributeType.MODIFIERS]],
              children: node.children,
              blockParams: node.blockParams,
            });
          } else {
            const modifiers = [...node[nodeType]];
            newNode = b.element(node.tag, {
              attrs: [...node[AttributeType.ATTRIBUTES]],
              modifiers: modifiers
                .sort((a, b) => (a.path.original > b.path.original ? 1 : -1))
                .map(({ path, params }) => b.elementModifier(b.path(path), params)),
              children: node.children,
              blockParams: node.blockParams,
            });
          }
          replaceNode(node, parentNode, parentKey, newNode);
        } else {
          this.log({
            message: this.createNotAlphabetizedErrorMessage(attributeType, source),
            isFixable: true,
            source,
            node: item,
          });
        }
      }
      if (this.isAttributeUnordered(attributeType, nodeTokens)) {
        const [, source, item] = this.findCurrentElement(attributeType, nodeTokens);
        if (this.mode === 'fix') {
          const attributesAndModifiers = [
            ...node[AttributeType.ATTRIBUTES],
            ...node[AttributeType.MODIFIERS],
          ];
          const sorted = attributesAndModifiers.sort((a, b) => {
            const orderA = this.getOrder(this.getAttributeType(a));
            const orderB = this.getOrder(this.getAttributeType(b));
            if (orderA === orderB) {
              return a.loc?.start.column > b.loc?.start.column;
            }
            return orderA > orderB ? 1 : -1;
          });

          const minColumn = sorted.reduce((prev, curr) => {
            return prev.loc?.start.column < curr.loc?.start.column ? prev : curr;
          }, {});

          const { attributes, modifiers } = sorted.reduce((acc, attr) => {
            const nodeType = this.getNodeType(this.getAttributeType(attr));
            if (!acc[nodeType]) {
              acc[nodeType] = [];
            }
            const line = minColumn.loc.start.line;
            const startColumn = acc.cursor || minColumn.loc.start.column;
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
          });

          replaceNode(node, parentNode, parentKey, newNode);
        } else {
          this.log({
            message: this.createUnorderedErrorMessage(attributeType, source),
            isFixable: true,
            source,
            node: item,
          });
        }
      }
    }
  }

  visitor() {
    return {
      ElementNode(node, { parentNode, parentKey }) {
        this.checkElementAttributesOrder(node, { parentNode, parentKey });
      },
      MustacheStatement(node) {
        this.checkMustacheAttributesOrder(node);
      },
    };
  }
}

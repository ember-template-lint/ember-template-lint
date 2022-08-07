import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

const AttributeType = {
  ARGUMENTS: 'arguments',
  ATTRIBUTES: 'attributes',
  MODIFIERS: 'modifiers',
  SPLATTRIBUTES: 'splattributes',
};

const DEFAULT_CONFIG = {
  attributeOrder: [
    AttributeType.ARGUMENTS,
    AttributeType.ATTRIBUTES,
    AttributeType.MODIFIERS,
    AttributeType.SPLATTRIBUTES,
  ],
};

export default class ElementAttributesOrder extends Rule {
  parseConfig(config) {
    if (config === true) {
      return DEFAULT_CONFIG;
    }

    if (config && typeof config === 'object') {
      return { ...DEFAULT_CONFIG, ...config };
    }

    let errorMessage = createErrorMessage(
      'element-attributes-order',
      [
        '  * boolean - `true` to enable / `false` to disable',
        '  * object -- An object with the following keys:',
        '  * `attributeOrder` -- array: order of attribute groups',
      ],
      config
    );

    throw new Error(errorMessage);
  }

  visitor() {
    const log = this.log.bind(this);
    const sourceForNode = this.sourceForNode.bind(this);
    const config = this.config;

    function extractElementTokens(node, nodeText) {
      const keys = [];
      for (const attr of node.attributes) {
        const source = sourceForNode(attr);
        const type = attr.name.startsWith('@')
          ? AttributeType.ARGUMENTS
          : attr.name.startsWith('...')
          ? AttributeType.SPLATTRIBUTES
          : AttributeType.ATTRIBUTES;
        keys.push([type, nodeText.indexOf(source), source, attr]);
      }
      for (const modifier of node.modifiers) {
        const source = sourceForNode(modifier);
        keys.push([AttributeType.MODIFIERS, nodeText.indexOf(source), source, modifier]);
      }
      return keys;
    }

    function combineElementTokens(tokens) {
      const result = {
        modifiers: [],
        attributes: [],
        splattributes: [],
        arguments: [],
      };
      // const result = Object.values(AttributeType).reduce((acc, attribute) => {
      // }
      for (let [name, index, source, node] of tokens) {
        result[name].push([index, source, node]);
      }
      return result;
    }

    function addMetaToCombinedTokens(tokens) {
      for (const tokenName of Object.keys(tokens)) {
        const indexes = tokens[tokenName].map(([index]) => Number(index));
        const firstLetters = tokens[tokenName].map(([, names]) =>
          names.startsWith('@') ? names.charAt(1) : names.charAt(0)
        );
        tokens[tokenName] = {
          items: tokens[tokenName],
          exists: tokens[tokenName].length !== 0,
          last_index: Math.max(...indexes),
          first_index: Math.min(...indexes),
          ordered: firstLetters.every((b, i, { [i - 1]: a }) => !i || a <= b),
        };
      }
      return tokens;
    }

    function findBadItem(attributeType, nodeTokens) {
      return nodeTokens[attributeType].items.find(
        ([index]) => index === nodeTokens[attributeType].last_index
      );
    }

    function capitalizedAttribute(string) {
      return string[0].toUpperCase() + string.slice(1, -1);
    }

    function createErrorMessage(attributeType, source) {
      const attributeOrder = config.attributeOrder.indexOf(attributeType);
      if (attributeOrder === 0) {
        const otherAttributes = `${config.attributeOrder[1]}, ${config.attributeOrder[2]} and ${config.attributeOrder[3]}`;

        return `${capitalizedAttribute(
          attributeType,
          true
        )} ${source} must go before ${otherAttributes}`;
      }
      return `${capitalizedAttribute(attributeType, true)} ${source} must go after ${
        config.attributeOrder[attributeOrder - 1]
      }`;
    }

    function isAttributeUnordered(attributeType, nodeTokens) {
      if (!nodeTokens[attributeType].exists) {
        return false;
      }
      const attributeOrder = config.attributeOrder.indexOf(attributeType);
      const hasAttributesAfterSplattributes =
        nodeTokens[AttributeType.SPLATTRIBUTES].exists &&
        nodeTokens[AttributeType.SPLATTRIBUTES].last_index <
          nodeTokens[AttributeType.ATTRIBUTES].last_index;

      if (attributeOrder === 0) {
        return (
          nodeTokens[attributeType].last_index > nodeTokens[config.attributeOrder[1]].first_index ||
          nodeTokens[attributeType].last_index > nodeTokens[config.attributeOrder[2]].first_index ||
          nodeTokens[attributeType].last_index > nodeTokens[config.attributeOrder[3]].first_index
        );
      }
      if (attributeOrder === 2) {
        if (attributeType !== AttributeType.MODIFIERS || !hasAttributesAfterSplattributes) {
          return (
            nodeTokens[attributeType].last_index < nodeTokens[config.attributeOrder[1]].last_index
          );
        }
      }
      if (attributeOrder === 3) {
        if (attributeType !== AttributeType.MODIFIERS || !hasAttributesAfterSplattributes) {
          return (
            nodeTokens[attributeType].last_index < nodeTokens[config.attributeOrder[2]].last_index
          );
        }
      }
    }

    function checkAttributesOrder(node) {
      if (!sourceForNode(node)) {
        return;
      }
      const nodeTokens = addMetaToCombinedTokens(
        combineElementTokens(extractElementTokens(node, sourceForNode(node)))
      );

      for (const attributeType of config.attributeOrder) {
        if (isAttributeUnordered(attributeType, nodeTokens)) {
          const [, source, item] = findBadItem(attributeType, nodeTokens);
          log({
            message: createErrorMessage(attributeType, source),
            line: item.loc.start.line,
            column: item.loc.start.column,
            source,
            node,
          });
        }
      }
    }

    return {
      ElementNode(node) {
        checkAttributesOrder(node);
      },
    };
  }
}

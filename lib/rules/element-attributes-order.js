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

    function getMustacheTokens(node, nodeText) {
      const keys = [];
      for (const attr of node.hash.pairs) {
        const source = sourceForNode(attr);
        keys.push([AttributeType.ATTRIBUTES, nodeText.indexOf(source), source, attr]);
      }
      return keys;
    }

    function getTokens(node, nodeText) {
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

    function groupTokens(tokens) {
      const result = Object.values(AttributeType).reduce((acc, attributeType) => {
        acc[attributeType] = [];
        return acc;
      }, {});
      for (let [name, index, source, node] of tokens) {
        result[name].push([index, source, node]);
      }
      return result;
    }

    function addMetadata(tokens) {
      for (const tokenName of Object.keys(tokens)) {
        const indexes = tokens[tokenName].map(([index]) => Number(index));
        const alpha = tokens[tokenName].map(
          ([, name]) => name.match(/([^A-Za-z]*)([A-Za-z-]*)/)[2]
        );
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

    function findUnalphabetizedElement(attributeType, nodeTokens) {
      return nodeTokens[attributeType].items[nodeTokens[attributeType].unalphabetized_item_pos];
    }

    function findCurrentElement(attributeType, nodeTokens) {
      return nodeTokens[attributeType].items.find(
        ([index]) => index === nodeTokens[attributeType].last_index
      );
    }

    function capitalizedAttribute(string) {
      return string[0].toUpperCase() + string.slice(1, -1);
    }

    function createNotAlphabetizedErrorMessage(attributeType, source) {
      return `${capitalizedAttribute(attributeType)} ${source} is not alphabetized`;
    }

    function createUnorderedErrorMessage(attributeType, source) {
      const attributeOrder = config.attributeOrder.indexOf(attributeType);
      if (attributeOrder === 0) {
        const otherAttributes = `${config.attributeOrder[1]}, ${config.attributeOrder[2]} and ${config.attributeOrder[3]}`;

        return `${capitalizedAttribute(attributeType)} ${source} must go before ${otherAttributes}`;
      }
      return `${capitalizedAttribute(attributeType)} ${source} must go after ${
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

    function checkMustacheAttributesOrder(node) {
      if (!sourceForNode(node)) {
        return;
      }
      const nodeTokens = addMetadata(groupTokens(getMustacheTokens(node, sourceForNode(node))));
      const attributeType = AttributeType.ATTRIBUTES;
      if (config.alphabetize && nodeTokens[attributeType].unalphabetized_item_pos >= 0) {
        const [, source, item] = findUnalphabetizedElement(attributeType, nodeTokens);
        log({
          message: createNotAlphabetizedErrorMessage(attributeType, source),
          line: item.loc.start.line,
          column: item.loc.start.column,
          source,
          node,
        });
      }
    }

    function checkElementAttributesOrder(node) {
      if (!sourceForNode(node)) {
        return;
      }
      const nodeTokens = addMetadata(groupTokens(getTokens(node, sourceForNode(node))));

      for (const attributeType of config.attributeOrder) {
        if (config.alphabetize && nodeTokens[attributeType].unalphabetized_item_pos >= 0) {
          const [, source, item] = findUnalphabetizedElement(attributeType, nodeTokens);
          log({
            message: createNotAlphabetizedErrorMessage(attributeType, source),
            line: item.loc.start.line,
            column: item.loc.start.column,
            source,
            node,
          });
        }
        if (isAttributeUnordered(attributeType, nodeTokens)) {
          const [, source, item] = findCurrentElement(attributeType, nodeTokens);
          log({
            message: createUnorderedErrorMessage(attributeType, source),
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
        checkElementAttributesOrder(node);
      },
      MustacheStatement(node) {
        checkMustacheAttributesOrder(node);
      },
    };
  }
}

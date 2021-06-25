'use strict';

const Rule = require('./base');

const AttributeType = {
  ARGUMENTS: 'arguments',
  ATTRIBUTES: 'attributes',
  MODIFIERS: 'modifiers',
  SPLATTRIBUTES: 'splattributes',
};
module.exports = class ElementAttributesOrder extends Rule {
  visitor() {
    const log = this.log.bind(this);
    const sourceForNode = this.sourceForNode.bind(this);

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

    function addMetaToCombinedTokens(tokens) {
      for (const tokenName of Object.keys(tokens)) {
        const indexes = tokens[tokenName].map(([index]) => index);
        tokens[`has_${tokenName}`] = tokens[tokenName].length !== 0;
        tokens[`${tokenName}_last_index`] = Math.max(indexes);
        tokens[`${tokenName}_first_index`] = Math.min(indexes);
      }
      return tokens;
    }

    function combineElementTokens(tokens) {
      const result = {
        modifiers: [],
        attributes: [],
        splattributes: [],
        arguments: [],
      };
      for (let [name, index, source, node] of tokens) {
        result[name].push([index, source, node]);
      }
      return result;
    }

    function checkAttributesOrder(node) {
      const maybeNodeSource = sourceForNode(node);
      if (!maybeNodeSource) {
        return;
      }
      const nodeTokens = addMetaToCombinedTokens(
        combineElementTokens(extractElementTokens(node, maybeNodeSource))
      );
      const {
        arguments_last_index,
        has_arguments,
        has_attributes,
        has_modifiers,
        has_splattributes,
        attributes_last_index,
        attributes_first_index,
        modifiers_last_index,
        modifiers_first_index,
        splattributes_last_index,
        splattributes_first_index,
      } = nodeTokens;
      if (has_arguments) {
        if (
          (arguments_last_index > attributes_first_index && has_attributes) ||
          (arguments_last_index > modifiers_first_index && has_modifiers) ||
          (arguments_last_index > splattributes_first_index && has_splattributes)
        ) {
          const [, source, item] = nodeTokens.arguments.find(
            ([index]) => index === arguments_last_index
          );
          return log({
            message: `Argument ${source} must go before attributes, modifiers and splattributes`,
            line: item.loc.start.line,
            column: item.loc.start.column,
            source,
          });
        }
        // each argument index should be minimal from other types
      }
      if (has_splattributes) {
        if (splattributes_last_index < modifiers_first_index && has_modifiers) {
          const [, source, item] = nodeTokens.splattributes.find(
            ([index]) => index === splattributes_last_index
          );
          return log({
            message: `Splattributes ${source} must go after modifiers`,
            line: item.loc.start.line,
            column: item.loc.start.column,
            source,
          });
        }
      }
      if (has_modifiers) {
        if (modifiers_last_index < attributes_last_index && has_attributes) {
          const hasAttributesAfterSplattributes =
            has_splattributes && splattributes_last_index < attributes_last_index;
          if (!hasAttributesAfterSplattributes) {
            const [, source, item] = nodeTokens.modifiers.find(
              ([index]) => index === modifiers_last_index
            );
            return log({
              message: `Modifier ${source} must go after attributes`,
              line: item.loc.start.line,
              column: item.loc.start.column,
              source,
            });
          }
        }
      }
    }

    return {
      ElementNode: (node) => {
        checkAttributesOrder(node);
      },
    };
  }
};

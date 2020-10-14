'use strict';

const NodeMatcher = require('../helpers/node-matcher');
const Rule = require('./base');

const ERROR_MESSAGE = 'ID attribute values must be unique';
module.exports = class NoDuplicateId extends Rule {
  // Handles the primary logic for the rule:
  // - if `idValue` is unique / not in the existing `idValueSet`; add it and carry on
  // - if it is a duplicate value; log the error
  logIfDuplicate(node, idValue) {
    if (!this.idValueSet.has(idValue)) {
      this.idValueSet.add(idValue);
    } else {
      this.log({
        message: ERROR_MESSAGE,
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: this.sourceForNode(node),
      });
    }
  }

  // Helper for getting `id` attribute node values from parent AST Node types
  // that store their attributes as an Array of HashPairs -- in this case,
  // MustacheStatements and BlockStatements
  getHashArgIdValue(node, idAttrName) {
    let idValue;
    let refPair = { key: idAttrName, value: { type: 'StringLiteral' } };
    let idHashArg = node.hash.pairs.find((testPair) => NodeMatcher.match(testPair, refPair));
    if (idHashArg) {
      idValue = idHashArg.value.value;
    }
    return idValue;
  }

  visitor() {
    // Visiting function node filter for AttrNodes: attribute name, node type
    function isValidIdAttrNode(node) {
      // consider removing `@id` eventually (or make it a toggle available via config)
      let isValidAttrNodeIdTag = ['id', '@id', '@elementId'].includes(node.name);
      let isValidAttrNodeIdValueType = [
        'TextNode',
        'MustacheStatement',
        'ConcatStatement',
      ].includes(node.value.type);

      return node && isValidAttrNodeIdTag && isValidAttrNodeIdValueType;
    }

    // Resolve MustacheStatement value to StringLiteral where possible
    function getMustacheValue(part, scope) {
      let isMustacheWithStringLiteral = {
        type: 'MustacheStatement',
        path: { type: 'StringLiteral' },
      };
      if (NodeMatcher.match(part, isMustacheWithStringLiteral)) {
        return part.path.value;
      }

      let isMustacheWithPathExpression = {
        type: 'MustacheStatement',
        path: { type: 'PathExpression' },
      };
      if (NodeMatcher.match(part, isMustacheWithPathExpression)) {
        return scope.sourceForNode(part);
      }
    }

    function getPartValue(part, scope) {
      if (part.type === 'TextNode') {
        return part.chars;
      } else {
        return getMustacheValue(part, scope);
      }
    }

    // Resolve ConcatStatement parts values to StringLiteral where possible
    function getJoinedConcatParts(node, scope) {
      return node.value.parts.map((part) => getPartValue(part, scope)).join('');
    }

    function handleCurlyNode(node) {
      let idValue = this.getHashArgIdValue(node, 'elementId');
      if (idValue) {
        this.logIfDuplicate(node, idValue);
        return;
      }

      idValue = this.getHashArgIdValue(node, 'id');
      if (idValue) {
        this.logIfDuplicate(node, idValue);
      }
    }

    // Store the idValues collected; reference to look for duplicates
    this.idValueSet = new Set();

    return {
      AttrNode(node) {
        // Only check relevant nodes
        if (!isValidIdAttrNode(node)) {
          return;
        }

        let idValue;
        switch (node.value.type) {
          // ConcatStatement: try to resolve parts to StringLiteral where possible
          // ex. id="id-{{"value"}}" becomes "id-value"
          // ex. id="id-{{value}}-{{"number"}}" becomes "id-{{value}}-number"
          case 'ConcatStatement':
            idValue = getJoinedConcatParts(node, this);
            break;

          // TextNode: unwrap
          // ex. id="id-value" becomes "id-value"
          case 'TextNode':
            idValue = node.value.chars;
            break;

          // MustacheStatement: try to resolve
          // ex. id={{"id-value"}} becomes "id-value"
          // ex. id={{idValue}} becomes "{{idValue}}"
          case 'MustacheStatement':
            idValue = getMustacheValue(node.value, this);
            break;

          default:
            // If idValue is not assigned by this point, use the raw source
            idValue = this.sourceForNode(node.value);
        }

        this.logIfDuplicate(node, idValue);
      },

      BlockStatement: handleCurlyNode,
      MustacheStatement: handleCurlyNode,
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

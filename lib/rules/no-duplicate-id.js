'use strict';

const NodeMatcher = require('../helpers/node-matcher');
const Rule = require('./base');

const ERROR_MESSAGE = 'ID attribute values must be unique';
module.exports = class NoDuplicateId extends Rule {
  // Handles the primary logic for the rule:
  // - Returns `true` if `idValue` is unique / not in the existing `idValueSet`
  // - Returns `false` if it is a duplicate value + logs the error
  processIdValueResult(node, idValue, idValueSet) {
    if (!idValueSet.has(idValue)) {
      return true;
    } else {
      this.log({
        message: ERROR_MESSAGE,
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: this.sourceForNode(node),
      });
      return false;
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
      let isValidAttrNodeIdTag = ['id', '@id'].includes(node.name);
      let isValidAttrNodeIdValueType = [
        'TextNode',
        'MustacheStatement',
        'ConcatStatement',
      ].includes(node.value.type);
      return node && isValidAttrNodeIdTag && isValidAttrNodeIdValueType;
    }

    // Resolve MustacheStatement value to StringLiteral where possible
    function getMustacheValue(part, scope) {
      let refNodeStr = { type: 'MustacheStatement', path: { type: 'StringLiteral' } };
      let refNodeDyn = { type: 'MustacheStatement', path: { type: 'PathExpression' } };
      if (NodeMatcher.match(part, refNodeStr)) {
        return part.path.value;
      }
      if (NodeMatcher.match(part, refNodeDyn)) {
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

    // Store the idValues collected; reference to look for duplicates
    let idValueSet = new Set();

    return {
      AttrNode(node) {
        // Only check relevant nodes
        if (!isValidIdAttrNode(node)) {
          return;
        }

        let idValue;

        // Check idValues that resolve to a StringLiteral

        // TextNode: unwrap
        // ex. id="id-value" becomes "id-value"
        if (node.value.type === 'TextNode') {
          idValue = node.value.chars;
        }

        // MustacheStatement: try to resolve
        // ex. id={{"id-value"}} becomes "id-value"
        // ex. id={{idValue}} becomes "{{idValue}}"
        if (node.value.type === 'MustacheStatement') {
          idValue = getMustacheValue(node.value, this);
        }

        // ConcatStatement: try to resolve parts to StringLiteral where possible
        // ex. id="id-{{"value"}}" becomes "id-value"
        // ex. id="id-{{value}}-{{"number"}}" becomes "id-{{value}}-number"
        if (node.value.type === 'ConcatStatement') {
          idValue = getJoinedConcatParts(node, this);
        }

        // If idValue is not assigned by this point, use the raw source
        if (!idValue) {
          idValue = this.sourceForNode(node.value);
        }

        if (this.processIdValueResult(node, idValue, idValueSet)) {
          idValueSet.add(idValue);
        }
      },

      // BlockStatements store attributes in a hash pair, so we have to check these in a different way
      BlockStatement(node) {
        let idValue = this.getHashArgIdValue(node, 'elementId');
        if (!idValue) {
          return;
        }
        if (this.processIdValueResult(node, idValue, idValueSet)) {
          idValueSet.add(idValue);
        }
      },

      // MustacheStatements also store attributes in a hash pair but they do not use `elementId` like blockStatements, they use `id` as the attribute name
      MustacheStatement(node) {
        let idValue = this.getHashArgIdValue(node, 'id');
        if (!idValue) {
          return;
        }
        if (this.processIdValueResult(node, idValue, idValueSet)) {
          idValueSet.add(idValue);
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

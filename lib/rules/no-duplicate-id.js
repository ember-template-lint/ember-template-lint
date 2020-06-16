'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'ID attribute values must be unique';

// Utility functions
// -----------------

// Visiting function node filter for AttrNodes: attribute name, node type
function isValidIdAttrNode(node) {
  let isIdAttrTag = ['id', '@id'].includes(node.name);
  let isValidnodeType = ['TextNode', 'MustacheStatement', 'ConcatStatement'].includes(
    node.value.type
  );
  return node && isIdAttrTag && isValidnodeType;
}

// MustacheStatement is StringLiteral
function isMustacheString(node) {
  return (
    node && node.value.type === 'MustacheStatement' && node.value.path.type === 'StringLiteral'
  );
}

// Verify ConcatStatement has only StringLiteral parts
function isConcatString(node) {
  // Helpers
  function partIsString(part) {
    return (
      part &&
      (part.type === 'TextNode' ||
        (part.type === 'MustacheStatement' && part.path.type === 'StringLiteral'))
    );
  }
  function allPartsAreStrings(parts) {
    return parts.every(partIsString);
  }
  // Result
  return node && node.value.type === 'ConcatStatement' && allPartsAreStrings(node.value.parts);
}

// Join ConcatStatement Parts
function getJoinedConcatParts(node) {
  // Helper
  function getPartValue(part) {
    return part.type === 'TextNode' ? part.chars : part.path.value;
  }
  // Result
  return node.value.parts.map(getPartValue).join('');
}

module.exports = class NoDuplicateId extends Rule {
  visitor() {
    let attrIdSet = new Set();
    return {
      AttrNode(node) {
        // Only check relevant nodes
        if (!isValidIdAttrNode(node)) {
          return;
        }

        // Assign an idValue only if it is entirely String, e.g.
        // id="id-value"
        // id={{"id-value"}}
        // id="id-{{"value"}}"
        // id="{{"id-"}}{{"value"}}"
        // or similar
        let idValue;

        // TextNode: unwrap
        // ----------------
        // id="id-value"
        if (node.value.type === 'TextNode') {
          idValue = node.value.chars;
        }

        // MustacheStatement: must be a String Literal
        // -------------------------------------------
        // id={{"id-value"}}
        if (isMustacheString(node)) {
          idValue = node.value.path.value;
        }

        // ConcatStatement: all parts must be String Literals
        // --------------------------------------------------
        // id="id-{{"value"}}" is all String parts: continue
        // id="id-{{this.value}}" has a dynamic part: bypass
        if (isConcatString(node)) {
          // Join `parts` if all Strings: "id-{{"value"}}": "id-value"
          idValue = getJoinedConcatParts(node);
        }

        // Bypass if idValue didn't get assigned by this point, i.e.,
        // it is not entirely composed of StringLiteral components
        if (!idValue) {
          return;
        }

        // Log if this is a duplicate idValue, add to the set if it is unique
        let isDuplicate = attrIdSet.has(idValue);
        if (isDuplicate) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        } else {
          attrIdSet.add(idValue);
        }
      },

      BlockStatement(node) {
        // Helpers
        function isElementIdHashPair(pair) {
          return pair.key === 'elementId';
        }
        function getElementIdHashPair(hashPairs) {
          return hashPairs.find(isElementIdHashPair);
        }
        function isValidElementIdHashPair(hashArg) {
          return hashArg && hashArg.value.type === 'StringLiteral';
        }
        // Validate BlockStatement: elementId="some-StringLiteral"
        let hashPairs = node.hash.pairs;
        let elementIdHashArg = getElementIdHashPair(hashPairs);
        if (!isValidElementIdHashPair(elementIdHashArg)) {
          return;
        }

        let idValue = elementIdHashArg.value.value;

        let isDuplicate = attrIdSet.has(idValue);
        if (isDuplicate) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        } else {
          attrIdSet.add(idValue);
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

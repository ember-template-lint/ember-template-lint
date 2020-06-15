'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'ID attribute values must be unique';

function isValidIdAttrNode(attrNode) {
  let isIdAttrTag = ['id', '@id'].includes(attrNode.name);
  let isValidAttrNodeType = ['TextNode','MustacheStatement','ConcatStatement'].includes(attrNode.value.type);
  return attrNode && isIdAttrTag && isValidAttrNodeType;
};
module.exports = class NoDuplicateId extends Rule {
  visitor() {
    let attrIdSet = new Set();
    return {
      AttrNode(node) {

        if ( !isValidIdAttrNode(node) ) {
          return;
        }

        // Assign an idValue only if it is entirely Stringy, e.g.
        // id="id-value"
        // id={{"id-value"}}
        // id="id-{{"value"}}"
        // id="{{"id-"}}{{"value"}}"
        let idValue;

        // id="id-value"
        if (node.value.type === 'TextNode') {
          idValue = node.value.chars;
        }

        // id={{"id-value"}}
        if (node.value.type === 'MustacheStatement' && node.value.path.type === 'StringLiteral')  {
          idValue = node.value.path.value;
        }

        // id="id-{{"value"}}"
        // Make sure all `parts` of the ConcatStatement are Strings
        if (node.value.type === 'ConcatStatement')  {
          let allParts = node.value.parts;
          let allPartsAreStrings = allParts.every(part => 
            (part.type === 'TextNode') || (part.type === 'MustacheStatement' && part.path.type === 'StringLiteral')
          );

          // id="id-{{this.value}}" should bypass dynamic values
          if (!allPartsAreStrings)  {
            return;
          }

          // Join `parts` if all Strings: "id-{{"value"}}" => "id-value"
          idValue = allParts.map(part =>
            part.type === 'TextNode' ?
              part.chars :
              part.path.value
          ).join('');
        }

        // If idValue didn't get assigned, i.e., not entirely Stringy
        if (!idValue )  {
          return;
        }

        // Log if this is a duplicate idValue, add to the set if it is unique
        let isDuplicate = attrIdSet.has(idValue);
        if (isDuplicate)  {
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

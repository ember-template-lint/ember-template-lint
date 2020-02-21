'use strict';

const Rule = require('./base');

function message(prefix, msgs) {
  return `Unexpected block usage. "${prefix}" ${msgs.join(' ')}`;
}

const AS_PREFIX_REGEXP = /\sas\s/gi;
const CLOSING_BLOCK_REGEXP = /\|(\s+)?>/gi;
module.exports = class NoInvalidBlockParamDefinition extends Rule {
  _checkForAsPrefix(node) {
    if (node.selfClosing) {
      return;
    }
    if (node.blockParams.length !== 0) {
      return;
    }

    const source = this.sourceForNode(node);
    const attributes = node.attributes
      .filter(el => {
        return el.name !== '|' && !el.name.startsWith('|') && !el.name.endsWith('|');
      })
      .map(el => {
        return this.sourceForNode(el);
      });
    const modifiers = node.modifiers.map(el => this.sourceForNode(el));
    const pureNodeSource = [...attributes, ...modifiers].reduce((result, src) => {
      return result.replace(src, '');
    }, source);

    const blockStartIndex = pureNodeSource.indexOf('|');
    const blockEndIndex = pureNodeSource.slice(blockStartIndex + 1).indexOf('|');
    const asPrefixMatchResult = AS_PREFIX_REGEXP.exec(pureNodeSource);
    const asKeywordIndex = asPrefixMatchResult ? asPrefixMatchResult.index : -1;
    const isValidEmptyBlock =
      asKeywordIndex === -1 && blockStartIndex === -1 && blockEndIndex === -1;
    if (!isValidEmptyBlock) {
      const msgs = [];
      if (asKeywordIndex === -1) {
        msgs.push('Missing " as " keyword before block symbol "|".');
      }
      if (blockStartIndex === -1) {
        msgs.push('Missing "|" block symbol after " as " keyword.');
      }
      if (blockEndIndex === -1) {
        if (!CLOSING_BLOCK_REGEXP.test(source)) {
          msgs.push('Missing second (closing) "|" block symbol.');
        } else {
          msgs.push('Missing "|" block symbol after " as " keyword.');
        }
      }
      const partBeforeFirstBlockEnd = source.slice(0, source.indexOf('>') + 1);
      this.log({
        message: message(partBeforeFirstBlockEnd, msgs),
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: partBeforeFirstBlockEnd,
      });
    }
  }

  visitor() {
    return {
      ElementNode(node) {
        this._checkForAsPrefix(node);
      },
    };
  }
};

module.exports.message = message;

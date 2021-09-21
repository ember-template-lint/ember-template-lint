'use strict';

const Rule = require('./_base');

function message(prefix, msgs) {
  return `Unexpected block usage in "${prefix}". ${msgs.join(' ')}`;
}

const AS_PREFIX_REGEXP = /\sas\s/gi;
const CLOSING_BLOCK_REGEXP = /\|(\s+)?>/gi;
const OPEN_BLOCK_REGEXP = /\|([\sA-z]+)(\s+)?>/gi;

const ERROR_MISSING_AS_KEYWORD = 'Missing " as " keyword before block symbol "|".';
const ERROR_MISSING_BLOCK_AFTER_KEYWORD = 'Missing "|" block symbol after " as " keyword.';
const ERROR_MISSING_CLOSING_BLOCK = 'Missing second (closing) "|" block symbol.';

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
      .filter((el) => {
        return el.name !== '|' && !el.name.startsWith('|') && !el.name.endsWith('|');
      })
      .map((el) => {
        return this.sourceForNode(el);
      });
    const modifiers = node.modifiers.map((el) => this.sourceForNode(el));
    const children = node.children.map((el) => this.sourceForNode(el));
    const comments = node.comments.map((el) => this.sourceForNode(el));
    const pureNodeSource = [...attributes, ...modifiers, ...children, ...comments].reduce(
      (result, src) => {
        return result.replace(src, '');
      },
      source
    );

    const blockStartIndex = pureNodeSource.indexOf('|');
    const blockEndIndex = pureNodeSource.slice(blockStartIndex + 1).indexOf('|');
    const asPrefixMatchResult = AS_PREFIX_REGEXP.exec(pureNodeSource);
    const asKeywordIndex = asPrefixMatchResult ? asPrefixMatchResult.index : -1;
    const isValidEmptyBlock =
      asKeywordIndex === -1 && blockStartIndex === -1 && blockEndIndex === -1;
    if (!isValidEmptyBlock) {
      const msgs = [];
      if (asKeywordIndex === -1) {
        msgs.push(ERROR_MISSING_AS_KEYWORD);
      }
      if (blockStartIndex === -1) {
        msgs.push(ERROR_MISSING_BLOCK_AFTER_KEYWORD);
      }
      if (blockEndIndex === -1) {
        if (OPEN_BLOCK_REGEXP.test(source)) {
          msgs.push(ERROR_MISSING_CLOSING_BLOCK);
        } else {
          if (!CLOSING_BLOCK_REGEXP.test(source)) {
            if (!msgs.length) {
              msgs.push(ERROR_MISSING_CLOSING_BLOCK);
            }
          } else {
            msgs.push(ERROR_MISSING_BLOCK_AFTER_KEYWORD);
          }
        }
      }
      const partBeforeFirstBlockEnd = source.slice(0, source.indexOf('>') + 1);
      this.log({
        message: message(partBeforeFirstBlockEnd, msgs),
        node,
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

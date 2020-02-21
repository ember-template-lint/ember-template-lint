'use strict';

const Rule = require('./base');

function message(tag, msgs) {
  return `Unexpected block usage. "<${tag} ... as |param1 param2|>" ${msgs.join(' ')}`;
}

module.exports = class NoInputBlock extends Rule {
  _checkForAsPrefix(node) {
    if (node.selfClosing) {
      return;
    }
    if (node.blockParams.length !== 0) {
      return;
    }

    const source = this.sourceForNode(node);
    const attributes = node.attributes.map(el => this.sourceForNode(el));
    const modifiers = node.modifiers.map(el => this.sourceForNode(el));
    const pureNodeSource = [...attributes, ...modifiers].reduce((result, src) => {
      return result.replace(src, '');
    }, source);

    const blockStartIndex = pureNodeSource.indexOf('|');
    const blockEndIndex = blockStartIndex + pureNodeSource.slice(blockStartIndex).indexOf('|');
    const asKeywordIndex = pureNodeSource.indexOf(' as ');
    const isValidEmptyBlock =
      asKeywordIndex === -1 && blockStartIndex === -1 && blockEndIndex === -1;
    if (!isValidEmptyBlock) {
      const msgs = [];
      if (asKeywordIndex === -1) {
        msgs.push('Missing " as " keyword before block symbol "|".');
      }
      if (blockStartIndex === -1) {
        msgs.push('Missing "|" block symbol.');
      }
      if (blockEndIndex === -1) {
        msgs.push('Missing second (closing) "|" block symbol.');
      }
      this.log({
        message: message(node.tag, msgs),
        line: node.loc && node.loc.start.line,
        column: node.loc && node.loc.start.column,
        source: source.slice(0, source.indexOf('>') + 1),
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

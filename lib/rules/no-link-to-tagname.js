'use strict';

const Rule = require('./base');

const ERROR_MESSAGE = 'Overriding `tagName` on `LinkTo` components is not allowed';

module.exports = class NoLinkToTagname extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        this.processAngleBracket(node);
      },

      BlockStatement(node) {
        this.processCurly(node);
      },

      MustacheStatement(node) {
        this.processCurly(node);
      },
    };
  }

  processAngleBracket(node) {
    let { attributes, tag } = node;
    if (tag !== 'LinkTo') {
      return;
    }

    let tagNameAttr = attributes.find((it) => it.name === '@tagName');
    if (tagNameAttr) {
      this.log({
        message: ERROR_MESSAGE,
        line: tagNameAttr.loc && tagNameAttr.loc.start.line,
        column: tagNameAttr.loc && tagNameAttr.loc.start.column,
        source: this.sourceForNode(tagNameAttr),
      });
    }
  }

  processCurly(node) {
    let { hash, path } = node;
    if (path.type !== 'PathExpression' || path.original !== 'link-to') {
      return;
    }

    let tagNameHashPair = hash.pairs.find((it) => it.key === 'tagName');
    if (tagNameHashPair) {
      this.log({
        message: ERROR_MESSAGE,
        line: tagNameHashPair.loc && tagNameHashPair.loc.start.line,
        column: tagNameHashPair.loc && tagNameHashPair.loc.start.column,
        source: this.sourceForNode(tagNameHashPair),
      });
    }
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;

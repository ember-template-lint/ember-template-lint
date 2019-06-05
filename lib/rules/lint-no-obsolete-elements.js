'use strict';

const Rule = require('./base');

const errorMessage = element => `Use of <${element}> detected. Do not use deprecated elements.`;

const OBSOLETE_ELEMENTS = [
  'applet',
  'acronym',
  'bgsound',
  'dir',
  'frame',
  'frameset',
  'noframes',
  'isindex',
  'keygen',
  'listing',
  'menuitem',
  'nextid',
  'noembed',
  'plaintext',
  'rb',
  'rtc',
  'strike',
  'xmp',
  'basefont',
  'big',
  'blink',
  'center',
  'font',
  'marquee',
  'multicol',
  'nobr',
  'spacer',
  'tt',
];

module.exports = class NoObsoleteElements extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (OBSOLETE_ELEMENTS.includes(node.tag)) {
          this.log({
            message: errorMessage(node.tag),
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

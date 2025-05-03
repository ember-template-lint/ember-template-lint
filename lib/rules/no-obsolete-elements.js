import Rule from './_base.js';

export function ERROR_MESSAGE_OBSOLETE_ELEMENT(element) {
  return `Use of <${element}> detected. Do not use deprecated elements.`;
}

// https://html.spec.whatwg.org/multipage/obsolete.html#non-conforming-features
export const OBSOLETE_ELEMENTS = [
  'acronym',
  'applet',
  'basefont',
  'bgsound',
  'big',
  'blink',
  'center',
  'dir',
  'font',
  'frame',
  'frameset',
  'isindex',
  'keygen',
  'listing',
  'marquee',
  'menuitem',
  'multicol',
  'nextid',
  'nobr',
  'noembed',
  'noframes',
  'param',
  'plaintext',
  'rb',
  'rtc',
  'spacer',
  'strike',
  'tt',
  'xmp',
];

export default class NoObsoleteElements extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        if (!this.isLocal(node) && OBSOLETE_ELEMENTS.includes(node.tag)) {
          this.log({
            message: ERROR_MESSAGE_OBSOLETE_ELEMENT(node.tag),
            node,
          });
        }
      },
    };
  }
}

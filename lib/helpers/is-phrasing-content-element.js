// TODO check if that is ok, i have commented out all void elements - i think that we could have a seperate rule
// that checks if void elements do not have any contents

var PHRASING_CONTENT_TAG_NAMES = [
  'abbr',
  'audio',
  'b',
  'bdo',
  // 'br',
  'button',
  'canvas',
  'cite',
  'canvas',
  'code',
  'canvas',
  // 'command',
  'datalist',
  'dfn',
  'em',
  'i',
  'iframe',
  // 'img',
  'iframe',
  // 'input',
  'kbd',
  // 'keygen',
  'label',
  'mark',
  'math',
  'meter',
  'noscript',
  'object',
  'output',
  'progress',
  'ruby',
  'samp',
  'script',
  'select',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'svg',
  'textarea',
  'time',
  'var',
  'video'
  // 'wbr'
];
module.exports = {
  isPhrasingContentElement: function(node) {
    return PHRASING_CONTENT_TAG_NAMES.indexOf(node.tag) > -1;
  }
};

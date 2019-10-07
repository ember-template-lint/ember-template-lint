// lint-no-whitespace-within-word.js
'use strict';
const Rule = require('./base');
const createErrorMessage = require('../helpers/create-error-message');
const ERROR_MESSAGE = 'Excess whitespace in layout detected.';

// Entity format: nbsp -> &nbsp; -> '\\&nbsp\\;'
// Number format: 160 -> &#160; -> '\\&\\#160\\;'
const blackList = [
  '\\&\\#32\\;', 
  ' ',
  '\\&\\#160\\;', 
  '\\&nbsp\\;', 
  '\\&NonBreakingSpace\\;',
  '\\&\\#8194\\;', 
  '\\&ensp\\;',
  '\\&\\#8195\\;', 
  '\\&emsp\\;',
  '\\&\\#8196\\;', 
  '\\&emsp13\\;',
  '\\&\\#8197\\;', 
  '\\&emsp14\\;',
  '\\&\\#8199\\;', 
  '\\&numsp\\;',
  '\\&\\#8200\\;', 
  '\\&puncsp\\;',
  '\\&\\#8201\\;', 
  '\\&thinsp\\;', 
  '\\&ThinSpace\\;',
  '\\&\\#8202\\;', 
  '\\&hairsp\\;', 
  '\\&VeryThinSpace\\;', 
  '\\&ThickSpace\\;',
  '\\&\\#8203\\;', 
  '\\&ZeroWidthSpace\\;', 
  '\\&NegativeVeryThinSpace\\;', 
  '\\&NegativeThinSpace\\;', 
  '\\&NegativeMediumSpace\\;', 
  '\\&NegativeThickSpace\\;',
  '\\&\\#8204\\;', 
  '\\&zwnj\\;',
  '\\&\\#8205\\;', 
  '\\&zwj\\;',
  '\\&\\#8206\\;', 
  '\\&lrm\\;',
  '\\&\\#8207\\;', 
  '\\&rlm\\;',
  '\\&\\#8287\\;', 
  '\\&MediumSpace\\;', 
  '\\&ThickSpace\\;',
  '\\&\\#8288\\;', 
  '\\&NoBreak\\;',
  '\\&\\#8289\\;', 
  '\\&ApplyFunction\\;', 
  '\\&af\\;',
  '\\&\\#8290\\;', 
  '\\&InvisibleTimes\\;', 
  '\\&it\\;',
  '\\&\\#8291\\;', 
  '\\&InvisibleComma\\;', 
  '\\&ic\\;'
];

// Join blackList entries into String as first capture group 
// [ blackList[0], blackList[1], ..., blackList[n] ] ->
// ((blackList[0])|(blackList[1])|...|(blackList[n]))
const blackListString = '\(\(' + blackList.join('\)|\(') + '/)\)';

// Second capture group: single non-whitepace character (\S)
const whiteListString = '\(\\S\)';

// Goal is to catch alternating blackList/whiteList 
// characters, for example, in 'W e l c o m e'
// So the final pattern boils down to 
// (anyBlackListItem)(anyWhiteListItem)(anyBlackListItem)(anyWhiteListItem)(anyBlackListItem)
// any less than this will return false positives
// any more than this should not be necessary in 99.99% of cases
const blackListRegExp = new RegExp(blackListString+whiteListString+blackListString+whiteListString+blackListString, 'g');


module.exports = class noWhitespaceWithinWord extends Rule {
  visitor() {
    return {
      TextNode(node) {
        let source = this.sourceForNode(node);
        let matches = source.match(blackListRegExp);
        if (matches !== null) {
          this.log({
            message: ERROR_MESSAGE,
            line: node.loc && node.loc.start.line,
            column: node.loc && node.loc.start.column,
            source: this.sourceForNode(node),
          });
        }
      },
    };
  }
};

module.exports.ERROR_MESSAGE = ERROR_MESSAGE;
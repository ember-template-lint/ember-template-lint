'use strict';

/*
 Enforce consistent linebreaks

 The following values are valid configuration:

   * boolean -- `true` for enabled (same as `unix`) / `false` for disabled
   * string -- `unix` for LF linebreaks / `windows` for CRLF linebreaks
 */

const Rule = require('./base');

const reLineEnds = /(\r\n?|\n)/g;
const reLines = /(.*?(?:\r\n?|\n|$))/gm;

const DEFAULT_CONFIG = {
  linebreak: '\n'
};

function toUserString(value) {
  return value.replace('\r', 'CR').replace('\n', 'LF');
}

module.exports = class LineBreakStyle extends Rule {
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
    case 'boolean':
      // if `true` use `DEFAULT_CONFIG`
      return config ? DEFAULT_CONFIG : false;
    case 'string':
      switch (config) {
      case 'unix':
        return DEFAULT_CONFIG;
      case 'windows':
        return {linebreak: '\r\n'};
      }
      break;
    case 'undefined':
      return false;
    }

    let errorMessage = 'The linebreak-style rule accepts one of the following values.\n ' +
      '  * boolean - `true` to enable (unix style) / `false` to disable\n' +
      '  * string -- `unix` for LF linebreaks / `windows` for CRLF linebreaks\n' +
      '\nYou specified `' + JSON.stringify(config) + '`';

    throw new Error(errorMessage);
  }

  visitor() {
    return {
      TextNode(node) {
        this._checkNodeAndLog(node);
      },
      MustacheStatement(node) {
        this._checkNodeAndLog(node);
      },
      BlockStatement(node) {
        this._checkNodeAndLog(node);
      },
      PartialStatement(node) {
        this._checkNodeAndLog(node);
      },
      MustacheCommentStatement(node) {
        this._checkNodeAndLog(node);
      },
      CommentStatement(node) {
        this._checkNodeAndLog(node);
      },
      ElementNode(node) {
        this._checkNodeAndLog(node);
      }
    };
  }

  _getWrongLinebreakFromLine(source) {
    let goodLinebreak = this.config.linebreak;
    let linebreaks = source.match(reLineEnds);

    if(linebreaks) {
      let linebreak = linebreaks[0];
      if(linebreak && linebreak !== goodLinebreak) {
        return linebreak;
      }
    }

    return null;
  }

  _checkNodeAndLog(node) {
    if (!node.loc) { return; }
    let nodeSource = this.sourceForNode(node);

    let lines = nodeSource.match(reLines);
    for(var i = 0; i < lines.length; i++) {
      let sourceLine = lines[i];
      let wrongLineBreak = this._getWrongLinebreakFromLine(sourceLine);
      if (wrongLineBreak) {
        let wrongLineBreakForDisplay = toUserString(wrongLineBreak);
        let goodLineBreakForDisplay = toUserString(this.config.linebreak);

        this.log({
          message: `Wrong linebreak used. Expected ${goodLineBreakForDisplay} but found ${wrongLineBreakForDisplay}`,
          line: i + node.loc.start.line,
          column: sourceLine.length - wrongLineBreak.length + (i === 0 ? node.loc.start.column : 0),
          source: wrongLineBreak
        });
      }
    }
  }
};

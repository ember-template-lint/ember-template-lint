import os from 'node:os';

import createErrorMessage from '../helpers/create-error-message.js';
import Rule from './_base.js';

/*
 Enforce consistent linebreaks

 The following values are valid configuration:

   * boolean -- `true` for enabled (same as `unix`) / `false` for disabled
   * string -- `unix` for LF linebreaks / `windows` for CRLF linebreaks
 */

const reLineEnds = /(\r\n?|\n)/g;
const reLines = /(.*?(?:\r\n?|\n|$))/gm;

function toUserString(value) {
  return value.replace('\r', 'CR').replace('\n', 'LF');
}

const matchMap = {
  lf: '\n',
  cr: '\r',
  crlf: '\r\n',
};

export default class LinebreakStyle extends Rule {
  constructor(options) {
    super(options);
    const configuredIndent = this.editorConfig['end_of_line'];
    if (['lf', 'cr', 'crlf'].includes(configuredIndent)) {
      this.config = matchMap[configuredIndent];
    }
  }
  parseConfig(config) {
    let configType = typeof config;

    switch (configType) {
      case 'boolean': {
        return config;
      }
      case 'string': {
        switch (config) {
          case 'system': {
            return os.EOL;
          }
          case 'unix': {
            return '\n';
          }
          case 'windows': {
            return '\r\n';
          }
        }
        break;
      }
      case 'undefined': {
        return false;
      }
    }

    let errorMessage = createErrorMessage(
      this.ruleName,
      [
        '* boolean -- `true` for enforcing consistency (all `CRLF` or all `LF` not both in a single file)',
        '* string -- `system` for the current platforms default line ending / `unix` for LF linebreaks / `windows` for CRLF linebreaks',
      ],
      config
    );

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
      PartialStatement(node) {
        this._checkNodeAndLog(node);
      },
      MustacheCommentStatement(node) {
        this._checkNodeAndLog(node);
      },
      CommentStatement(node) {
        this._checkNodeAndLog(node);
      },
    };
  }

  _getWrongLinebreakFromLine(source) {
    let linebreaks = source.match(reLineEnds);

    if (linebreaks) {
      let linebreak = linebreaks[0];
      if (!linebreak) {
        return null;
      }

      if (this.config === true) {
        this.config = linebreak;
      }

      if (linebreak !== this.config) {
        return linebreak;
      }
    }

    return null;
  }

  _checkNodeAndLog(node) {
    if (!node.loc) {
      return;
    }
    let nodeSource = this.sourceForNode(node);

    let lines = nodeSource.match(reLines);
    for (const [i, sourceLine] of lines.entries()) {
      let wrongLineBreak = this._getWrongLinebreakFromLine(sourceLine);
      if (wrongLineBreak) {
        let wrongLineBreakForDisplay = toUserString(wrongLineBreak);
        let goodLineBreakForDisplay = toUserString(this.config);

        this.log({
          message: `Wrong linebreak used. Expected ${goodLineBreakForDisplay} but found ${wrongLineBreakForDisplay}`,
          node,
          line: i + node.loc.start.line,
          column: sourceLine.length - wrongLineBreak.length + (i === 0 ? node.loc.start.column : 0),
          source: wrongLineBreak,
        });
      }
    }
  }
}

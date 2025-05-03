import Rule from './_base.js';

export const CONFIG_ERROR_MESSAGE =
  'Invalid rule configuration for `no-multiple-empty-lines` found';

export default class NoMultipleEmptyLines extends Rule {
  parseConfig(config) {
    return parseConfig(config);
  }

  visitor() {
    // Swallow the final newline, as some editors add it automatically and we don't want it to cause an issue
    let allLines = this.source.at(-1) === '' ? this.source.slice(0, -1) : this.source;

    return {
      Template: {
        exit(node) {
          let max = 'max' in this.config ? this.config.max : 1;
          if (this.mode === 'fix') {
            let fixChars = '\n';
            for (let i = 0; i < max; i++) {
              fixChars += '\n';
            }
            let copyNode = node.body;
            for (const element of copyNode) {
              if (element['type'] === 'TextNode') {
                if (element.chars.length > max) {
                  element.chars = fixChars;
                }
              }
            }
            node.body = copyNode;
            return node;
          } else {
            [
              ...allLines

                // Given a list of lines, first get a list of line numbers that are non-empty.
                .reduce((nonEmptyLineNumbers, line, index) => {
                  if (line.trim()) {
                    nonEmptyLineNumbers.push(index + 1);
                  }
                  return nonEmptyLineNumbers;
                }, []),

              // Add a value at the end to allow trailing empty lines to be checked.
              allLines.length + 1,
            ]

              // Given two line numbers of non-empty lines, report the lines between if the difference is too large.
              .reduce((lastLineNumber, lineNumber) => {
                if (lineNumber - lastLineNumber - 1 > max) {
                  let message = `More than ${max} blank ${
                    max === 1 ? 'line' : 'lines'
                  } not allowed.`;

                  let loc = {
                    start: { line: lastLineNumber + max, column: 0 },
                    end: { line: lineNumber, column: 0 },
                  };

                  this.log({
                    message,
                    node,
                    isFixable: true,
                    line: loc.start.line,
                    column: loc.start.column,
                    source: this.sourceForLoc(loc),
                  });
                }

                return lineNumber;
              }, 0);
          }
        },
      },
    };
  }
}

export function parseConfig(config) {
  if (config === true) {
    return { max: 1 };
  }

  if (typeof config !== 'object' || config === null) {
    throw new Error(CONFIG_ERROR_MESSAGE);
  }

  let max = config.max;
  if (typeof max !== 'number') {
    throw new TypeError(CONFIG_ERROR_MESSAGE);
  }

  return { max };
}

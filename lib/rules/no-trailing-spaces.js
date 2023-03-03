import Rule from './_base.js';

export default class NoTrailingSpaces extends Rule {
  visitor() {
    return {
      Template: {
        // implementation goes here in exit(): in the exit handler, the rule will not
        // be called if it has been disabled by any inline comments within the file.

        exit(node) {
          let source = this.sourceForNode(node);
          let lines = source.split('\n');

          for (const [i, line] of lines.entries()) {
            let column = line.length - 1;
            let isLastLine = i === lines.length - 1;

            if (line[column] === ' ' && (!isLastLine || column > this.columnOffset)) {
              this.log({
                message: 'line cannot end with space',
                node,
                line: i + 1,
                column,
                source: line,
              });
            }
          }
        },
      },
    };
  }
}

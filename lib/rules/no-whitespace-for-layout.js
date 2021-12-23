import Rule from './_base.js';

const ERROR_MESSAGE = 'Excess whitespace detected.';

export default class NoWhitespaceForLayout extends Rule {
  visitor() {
    return {
      TextNode(node) {
        let source = this.sourceForNode(node);

        let lines = source.split('\n');
        for (let line of lines) {
          // ignore whitespace at the start and end of the line
          let trimmed = line.trim();

          // check for two ` ` or `&nbsp;` in a row
          let matches = trimmed.match(/(( )|(&nbsp;))(( )|(&nbsp;))/g);
          if (matches !== null) {
            this.log({
              message: ERROR_MESSAGE,
              node,
            });

            return;
          }
        }
      },
    };
  }
}

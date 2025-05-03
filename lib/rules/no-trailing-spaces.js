import Rule from './_base.js';
import { builders as b } from 'ember-template-recast';
import replaceNode from '../helpers/replace-node.js';

export default class NoTrailingSpaces extends Rule {
  visitor() {
    return {
      TextNode(node, { parentNode, parentKey }) {
        const sourceLines = this.source.join('').split('\n');
        const charsSplit = node.chars.split('\n');
        const newChars = [...charsSplit];

        for (const [idx, element] of charsSplit.entries()) {
          const match = /\s+$/.exec(element);
          if (match) {
            const lineNum = node.loc.start.line + idx;
            const sourceLine = sourceLines[lineNum - 1];
            const column = match.index;

            /**
             * We want to make sure this chunk of whitespace is at the end of the line
             */
            const endColumn = column + match[0].length;
            const isEndOfLine = endColumn === sourceLine.length;

            /**
             * We also want to make sure that if this is the last line, it's not just the column offset whitespace
             * This will prevent things like the last line of an embedded template from being flagged:
             *   await render(hbs`
             *     <div></div>
             *   `); // this line won't get flagged
             */
            const isLastLine = lineNum === sourceLines.length;
            const isNotLastLineOffset = !isLastLine || column > this.columnOffset;

            if (isEndOfLine && isNotLastLineOffset) {
              if (this.mode === 'fix') {
                newChars[idx] = element.replaceAll(/\s+$/g, '');
              } else {
                this.log({
                  message: 'line cannot end with space',
                  node,
                  line: lineNum,
                  column,
                  isFixable: true,
                  source: element,
                });
              }
            }
          }
        }

        if (this.mode === 'fix') {
          const newNode = b.text(newChars.join('\n'));
          replaceNode(node, parentNode, parentKey, newNode);
        }
      },
    };
  }
}

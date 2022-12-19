import Rule from './_base.js';

export default class NoTrailingSpaces extends Rule {
  visitor() {
    return {
      Template: {
        // implementation goes here in exit(): in the exit handler, the rule will not
        // be called if it has been disabled by any inline comments within the file.

        exit(node) {
          let source = this.sourceForNode(node);
          let fixer = source
            .split('\n')
            .map((element) => element.replace(/\s+$/g, ''))
            .join('\n');
          let copyNode = node;
          if (this.mode === 'fix') {
            for (const element of copyNode.body) {
              if (element.type === 'BlockStatement') {
                copyNode.loc.data.source.source = fixer;
              } else {
                element.chars = fixer;
              }
            }
            node = copyNode;
            return node;
          } else {
            for (const [i, line] of source.split('\n').entries()) {
              let column = line.length - 1;
              if (line[column] === ' ') {
                this.log({
                  message: 'line cannot end with space',
                  node,
                  line: i + 1,
                  isFixable: true,
                  column,
                  source: line,
                });
              }
            }
          }
        },
      },
    };
  }
}

import Rule from './_base.js';

export default class NoUnnecessaryConcat extends Rule {
  visitor() {
    return {
      ConcatStatement(node) {
        if (node.parts.length === 1) {
          let mustacheStatement = node.parts[0];
          let source = this.sourceForNode(node);
          let innerSource = this.sourceForNode(mustacheStatement);
          let message = `Unnecessary string concatenation. Use ${innerSource} instead of ${source}.`;
          let isFixable = true;

          if (this.mode === 'fix') {
            return mustacheStatement;
          } else {
            this.log({
              message,
              node,
              source,
              isFixable,
            });
          }
        }
      },
    };
  }
}

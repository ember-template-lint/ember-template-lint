import Rule from './_base.js';

const message = 'Unexpected {{debugger}} usage.';

export default class NoDebugger extends Rule {
  _checkForDebugger(node) {
    if (node.path.original === 'debugger') {
      this.log({
        message,
        node,
      });
    }
  }

  /**
   * @returns {import('./types.js').VisitorReturnType<NoDebugger>}
   */
  visitor() {
    return {
      MustacheStatement(node) {
        this._checkForDebugger(node);
      },

      BlockStatement(node) {
        this._checkForDebugger(node);
      },
    };
  }
}

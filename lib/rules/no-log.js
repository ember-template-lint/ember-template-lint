import Rule from './_base.js';

const ERROR_MESSAGE = 'Unexpected {{log}} usage.';

export default class NoLog extends Rule {
  _checkForLog(node) {
    if (node.path.original === 'log' && !this.isLocal(node)) {
      this.log({
        message: ERROR_MESSAGE,
        node,
      });
    }
  }

  visitor() {
    return {
      MustacheStatement(node) {
        this._checkForLog(node);
      },

      BlockStatement(node) {
        this._checkForLog(node);
      },
    };
  }
}

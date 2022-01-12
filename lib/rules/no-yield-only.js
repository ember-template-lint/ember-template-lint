import Rule from './_base.js';

const ERROR_MESSAGE = '{{yield}}-only templates are not allowed';

export default class NoYieldOnly extends Rule {
  visitor() {
    if (this._rawSource.trim() !== '{{yield}}') {
      return;
    }

    return {
      MustacheStatement(node) {
        this.log({
          message: ERROR_MESSAGE,
          node,
        });
      },
    };
  }
}

import Rule from './_base.js';

export const ERROR_MESSAGE =
  'Templates are required to be in strict mode. Consider refactoring to template tag format.';

export default class RequireStrictMode extends Rule {
  visitor() {
    return {
      Template: {
        exit(node) {
          if (!this.isStrictMode) {
            this.log({
              message: ERROR_MESSAGE,
              node,
            });
          }
        },
      },
    };
  }
}

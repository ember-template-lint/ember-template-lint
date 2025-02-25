/**
 * @fileOverview Detects unused template-lint-disable comments
 * @author ember-template-lint contributors
 */

/**
 * Reports template-lint-disable directives that are not used to suppress any lint violations.
 *
 * This rule reports directives that are not needed at all because there are no violations
 * being suppressed by the disable directive.
 *
 * @class NoUnusedDisable
 */
import Rule from './_base.js';

export default class NoUnusedDisable extends Rule {
  visitor() {
    return {
      Program: {
        exit(node) {
          for (let directive of this._disabledRules) {
            if (!this._usedDisabledRules.has(directive)) {
              this.log({
                message: 'Unused disable directive',
                node: directive,
              });
            }
          }
        },
      },
    };
  }
}

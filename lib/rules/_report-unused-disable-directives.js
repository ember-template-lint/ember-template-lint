// eslint-disable-next-line filenames/match-exported
import BaseRule from './_base.js';

export default class ReportUnusedDisableDirectives extends BaseRule {
  constructor(options) {
    super(options);
    if (!options?.activeRules) {
      throw new Error('ReportUnusedDisableDirectives requires activeRules to be set in options');
    }
    this.activeRules = options.activeRules;
  }

  // This rule is always enabled when in use, even without a config
  isDisabled() {
    return false;
  }

  // This rule masquerades as any rule that is recognized, but not actually enabled globally
  _refersToCurrentRule(name) {
    return !this.activeRules.includes(name);
  }
}

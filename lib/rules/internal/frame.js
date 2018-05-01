'use strict';

class Frame {
  constructor(locals) {
    this.locals = locals;
    this.hasPartial = false;
    this.usedLocals = {};

    for (let i = 0; i < locals.length; i++) {
      this.usedLocals[locals[i]] = false;
    }
  }

  useLocal(name) {
    if (name in this.usedLocals) {
      this.usedLocals[name] = true;
      return true;
    } else {
      return false;
    }
  }

  usePartial() {
    this.hasPartial = true;
  }

  unusedLocals() {
    if (!this.hasPartial && this.locals.length > 0) {
      if (!this.usedLocals[this.locals[this.locals.length - 1]]) {
        return this.locals[this.locals.length - 1];
      }
    } else {
      return false;
    }
  }

  isLocal(name) {
    return this.locals.indexOf(name) !== -1;
  }
}

module.exports = Frame;

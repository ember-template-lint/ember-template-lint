'use strict';

function getLocalName(node) {

  switch (node.type) {
  case 'ElementNode':
    // unfortunately the ElementNode stores `tag` as a string
    // if that changes in glimmer-vm this will need to be updated
    return node.tag.split('.')[0];

  default:
    return node.parts[0];
  }
}

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

class Scope {
  constructor() {
    this.frames = [];
  }

  pushFrame(locals) {
    this.frames.push(new Frame(locals));
  }

  popFrame() {
    this.frames.pop();
  }

  frameHasUnusedBlockParams() {
    return this.frames[this.frames.length - 1].unusedLocals();
  }

  useLocal(node) {
    let name = getLocalName(node);

    for (let i = this.frames.length - 1; i >= 0; i--) {
      if (this.frames[i].useLocal(name)) {
        break;
      }
    }
  }

  usePartial() {
    for (let i = this.frames.length - 1; i >= 0; i--) {
      this.frames[i].usePartial();
    }
  }

  isLocal(node) {
    let name = getLocalName(node);

    for (let i = this.frames.length - 1; i >= 0; i--) {
      if (this.frames[i].isLocal(name)) {
        return true;
      }
    }
  }
}

module.exports = Scope;

'use strict';

const Frame = require('./frame');

class Scope {
  constructor() {
    this.frames = [];
  }

  pushFrame(block) {
    this.frames.push(new Frame(block.program.blockParams));
  }

  popFrame() {
    this.frames.pop();
  }

  frameHasUnusedBlockParams() {
    return this.frames[this.frames.length - 1].unusedLocals();
  }

  usePath(path) {
    let name = path.parts[0];

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
    for (let i = this.frames.length - 1; i >= 0; i--) {
      if (this.frames[i].isLocal(node.path.original)) {
        return true;
      }
    }
  }
}

module.exports = Scope;

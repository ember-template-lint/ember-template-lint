function getLocalName(node) {
  switch (node.type) {
    case 'ElementNode': {
      // unfortunately the ElementNode stores `tag` as a string
      // if that changes in glimmer-vm this will need to be updated
      return node.tag.split('.')[0];
    }

    case 'SubExpression':
    case 'MustacheStatement':
    case 'BlockStatement':
    case 'ElementModifierStatement': {
      return getLocalName(node.path);
    }

    case 'UndefinedLiteral':
    case 'NullLiteral':
    case 'BooleanLiteral':
    case 'StringLiteral':
    case 'NumberLiteral':
    case 'TextNode':
    case 'Template':
    case 'Block':
    case 'MustacheCommentStatement': {
      return undefined;
    }
    // case 'PathExpression':
    default: {
      return node.parts.length ? node.parts[0] : undefined;
    }
  }
}

function getLocals(node) {
  switch (node.type) {
    case 'ElementNode':
    case 'Program':
    case 'Block':
    case 'Template': {
      return node.blockParams;
    }

    case 'BlockStatement': {
      return node.program.blockParams;
    }

    default: {
      throw new Error(`Unknown frame type: ${node.type}`);
    }
  }
}

class Frame {
  constructor(node) {
    let locals = getLocals(node);

    this.node = node;
    this.locals = locals;
    this.hasPartial = false;
    this.usedLocals = {};

    for (const local of locals) {
      this.usedLocals[local] = false;
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
      if (!this.usedLocals[this.locals.at(-1)]) {
        return this.locals.at(-1);
      }
    } else {
      return false;
    }
  }

  isLocal(name) {
    return this.locals.includes(name);
  }
}

export default class Scope {
  constructor() {
    /**
     * @type {Array<Frame>}
     * @public
     */
    this.frames = [];
  }

  pushFrame(node) {
    this.frames.push(new Frame(node));
  }

  popFrame() {
    this.frames.pop();
  }

  frameHasUnusedBlockParams() {
    return this.frames.at(-1).unusedLocals();
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

  /**
   *
   * @param {import('ember-template-recast').AST.Node} node
   * @returns {boolean}
   */
  isLocal(node) {
    let name = getLocalName(node);
    if (typeof name !== 'string') {
      return false;
    }

    for (let i = this.frames.length - 1; i >= 0; i--) {
      if (this.frames[i].isLocal(name)) {
        return true;
      }
    }

    return false;
  }

  get currentNode() {
    let currentFrame = this.frames.at(-1);

    return currentFrame && currentFrame.node;
  }
}

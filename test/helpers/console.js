class FakeConsole {
  constructor() {
    this._logLines = [];
  }

  log(data) {
    this._logLines.push(data);
  }

  get stdout() {
    return this._logLines.join('\n');
  }
}

function buildFakeConsole() {
  return new FakeConsole();
}

module.exports = buildFakeConsole;

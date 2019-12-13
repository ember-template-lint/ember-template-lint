function buildFakeConsole() {
  return {
    _logLines: [],

    log(data) {
      this._logLines.push(data);
    },
  };
}

module.exports = buildFakeConsole;

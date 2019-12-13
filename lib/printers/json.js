class JsonPrinter {
  constructor(options = {}) {
    this.console = options.console || console;
  }

  print(errors) {
    this.console.log(JSON.stringify(errors, null, 2));
  }
}

module.exports = JsonPrinter;

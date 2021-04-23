const Linter = require('../linter');

class JsonPrinter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(results) {
    if (!this.options.hasResultData) {
      return;
    }

    let filteredErrors = {};
    for (let filePath of Object.keys(results.files)) {
      let fileErrors = results.files[filePath].messages;

      let errorsFiltered = fileErrors.filter((error) => error.severity === Linter.ERROR_SEVERITY);
      let warnings = this.options.quiet
        ? []
        : fileErrors.filter((error) => error.severity === Linter.WARNING_SEVERITY);
      let todos =
        this.options.quiet || !this.options.includeTodo
          ? []
          : fileErrors.filter((error) => error.severity === Linter.TODO_SEVERITY);

      filteredErrors[filePath] = [...errorsFiltered, ...warnings, ...todos];
    }

    let json = JSON.stringify(filteredErrors, null, 2);

    this.console.log(json);
  }
}

module.exports = JsonPrinter;

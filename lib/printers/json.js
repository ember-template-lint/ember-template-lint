const Linter = require('../index');

class JsonPrinter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(errors) {
    let filteredErrors = {};
    for (let filePath of Object.keys(errors)) {
      let fileErrors = errors[filePath] || [];

      let errorsFiltered = fileErrors.filter(error => error.severity === Linter.ERROR_SEVERITY);
      let warnings = this.options.quiet
        ? []
        : fileErrors.filter(error => error.severity === Linter.WARNING_SEVERITY);

      filteredErrors[filePath] = errorsFiltered.concat(warnings);
    }

    this.console.log(JSON.stringify(filteredErrors, null, 2));
  }
}

module.exports = JsonPrinter;

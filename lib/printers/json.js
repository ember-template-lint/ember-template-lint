const Linter = require('../linter');

class JsonPrinter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(results) {
    let filteredErrors = {};
    for (let filePath of Object.keys(results.files)) {
      let fileErrors = results.files[filePath].messages;

      let errorsFiltered = fileErrors.filter((error) => error.severity === Linter.ERROR_SEVERITY);
      let warnings = this.options.quiet
        ? []
        : fileErrors.filter((error) => error.severity === Linter.WARNING_SEVERITY);

      filteredErrors[filePath] = [...errorsFiltered, ...warnings];
    }

    this.console.log(JSON.stringify(filteredErrors, null, 2));
  }
}

module.exports = JsonPrinter;

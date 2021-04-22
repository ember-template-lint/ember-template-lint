const writeOutputFile = require('../helpers/write-output-file');
const Linter = require('../linter');

class JsonPrinter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(results) {
    if (!this.options.hasResultData && !this.options.outputFile) {
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

    if (this.options.isInteractive && this.options.outputFile) {
      let outputPath = writeOutputFile(json, 'json', this.options);
      this.console.log(`Report written to ${outputPath}`);
    } else {
      this.console.log(json);
    }
  }
}

module.exports = JsonPrinter;

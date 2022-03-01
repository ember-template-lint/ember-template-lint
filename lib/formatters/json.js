import Linter from '../linter.js';

export default class JsonFormatter {
  defaultFileExtension = 'json';

  constructor(options = {}) {
    this.options = options;
  }

  format(results) {
    let filteredErrors = {};

    if (!this.options.hasResultData) {
      return '';
    }

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

    return JSON.stringify(filteredErrors, null, 2);
  }
}

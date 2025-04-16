import kakouneFormatter from 'eslint-formatter-kakoune';

import Linter from '../linter.js';

export default class KakouneFormatter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  format(results) {
    let filteredErrors = {};
    for (let filePath of Object.keys(results.files)) {
      let fileErrors = results.files[filePath].messages;

      let errorsFiltered = fileErrors.filter((error) => error.severity === Linter.ERROR_SEVERITY);
      let warnings = this.options.quiet
        ? []
        : fileErrors.filter((error) => error.severity === Linter.WARNING_SEVERITY);

      filteredErrors[filePath] = [...errorsFiltered, ...warnings];
    }

    results = Object.entries(filteredErrors).map(([filePath, messages]) => {
      return {
        filePath,
        messages: [...messages].map((message) => {
          return {
            ...message,
            // Columns start at 1 in Kakoune and not at 0.
            column: message.column + 1,
            endColumn: message.endColumn + 1,
            ruleId: message.rule,
          };
        }),
      };
    });
    return kakouneFormatter(results);
  }
}

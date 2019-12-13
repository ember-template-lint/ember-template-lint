const chalk = require('chalk');
const Linter = require('../index');

class PrettyPrinter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(errors) {
    let errorCount = 0;
    let warningCount = 0;

    for (const filePath of Object.keys(errors)) {
      let fileErrors = errors[filePath] || [];

      let errorsFiltered = fileErrors.filter(error => error.severity === Linter.ERROR_SEVERITY);
      let warnings = this.options.quiet
        ? []
        : fileErrors.filter(error => error.severity === Linter.WARNING_SEVERITY);

      errorCount += errorsFiltered.length;
      warningCount += warnings.length;

      let allIssues = errorsFiltered.concat(warnings);

      let messages = PrettyPrinter.errorsToMessages(filePath, allIssues, this.options);
      if (messages !== '') {
        this.console.log(messages);
      }
    }

    let count = errorCount + warningCount;

    if (count > 0) {
      this.console.log(
        chalk.red(
          chalk.bold(`✖ ${count} problems (${errorCount} errors, ${warningCount} warnings)`)
        )
      );
    }
  }

  static errorsToMessages(filePath, errors, options = {}) {
    errors = errors || [];

    if (errors.length === 0) {
      return '';
    }

    let errorsMessages = errors.map(error => PrettyPrinter._formatError(error, options)).join('\n');

    return `${chalk.underline(filePath)}\n${errorsMessages}\n`;
  }

  static _formatError(error, options = {}) {
    let message = '';

    let line = error.line === undefined ? '-' : error.line;
    let column = error.column === undefined ? '-' : error.column;

    message += chalk.dim(`  ${line}:${column}`);

    if (error.severity === Linter.WARNING_SEVERITY) {
      message += `  ${chalk.yellow('warning')}`;
    } else {
      message += `  ${chalk.red('error')}`;
    }

    message += `  ${error.message}  ${chalk.dim(error.rule)}`;

    if (options.verbose) {
      message += `\n${error.source}`;
    }

    return message;
  }
}

module.exports = PrettyPrinter;

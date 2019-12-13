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
      let fileErrors = errors[filePath];

      let warnings = fileErrors.filter(error => error.severity === Linter.WARNING_SEVERITY);

      errorCount += fileErrors.length - warnings.length;
      warningCount += warnings.length;

      let messages = this.errorsToMessages(filePath, fileErrors, this.options);
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

  errorsToMessages(filePath, errors) {
    errors = errors || [];

    if (errors.length === 0) {
      return '';
    }

    let errorsMessages = errors.map(error => this._formatError(error)).join('\n');

    return `${chalk.underline(filePath)}\n${errorsMessages}\n`;
  }

  _formatError(error) {
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

    if (this.options.verbose) {
      message += `\n${error.source}`;
    }

    return message;
  }
}

module.exports = PrettyPrinter;

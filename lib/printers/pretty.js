const chalk = require('chalk');

const Linter = require('../linter');

class PrettyPrinter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(results) {
    for (const filePath of Object.keys(results.files)) {
      let fileResults = results.files[filePath];
      let messages = this.options.quiet
        ? fileResults.messages.filter((r) => r.severity !== Linter.WARNING_SEVERITY)
        : fileResults.messages;

      let output = PrettyPrinter.errorsToMessages(filePath, messages, this.options);
      if (output !== '') {
        this.console.log(output);
      }
    }

    let warningCount = this.options.quiet ? 0 : results.warningCount;
    let count = results.errorCount + warningCount;

    if (count > 0) {
      this.console.log(
        chalk.red(
          chalk.bold(`✖ ${count} problems (${results.errorCount} errors, ${warningCount} warnings)`)
        )
      );

      if (results.fixableErrorCount > 0 || results.fixableWarningCount > 0) {
        this.console.log(
          chalk.red(
            chalk.bold(
              `  ${results.fixableErrorCount} errors and ${results.fixableWarningCount} warnings potentially fixable with the \`--fix\` option.`
            )
          )
        );
      }
    }
  }

  static errorsToMessages(filePath, errors, options = {}) {
    errors = errors || [];

    if (errors.length === 0) {
      return '';
    }

    let errorsMessages = errors
      .map((error) => PrettyPrinter._formatError(error, options))
      .join('\n');

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

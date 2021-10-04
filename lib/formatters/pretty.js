const chalk = require('chalk');

const Linter = require('../linter');

class PrettyPrinter {
  constructor(options = {}) {
    this.options = options;
    this.console = options.console || console;
  }

  print(results, todoInfo) {
    if (!this.options.hasResultData) {
      return;
    }

    for (const filePath of Object.keys(results.files)) {
      let fileResults = results.files[filePath];
      let messages = this.options.quiet
        ? fileResults.messages.filter((r) => r.severity > Linter.WARNING_SEVERITY)
        : fileResults.messages;

      let output = PrettyPrinter.errorsToMessages(filePath, messages, this.options);
      if (output !== '') {
        this.console.log(output);
      }
    }

    let warningCount = this.options.quiet ? 0 : results.warningCount;
    let shouldNotPrintTodos = !this.options.includeTodo;
    let todoCount = this.options.quiet || shouldNotPrintTodos ? 0 : results.todoCount;
    let count = results.errorCount + warningCount + todoCount;

    if (count > 0) {
      let todoSummary = this.options.includeTodo ? `, ${todoCount} todos` : '';

      this.console.log(
        chalk.red(
          chalk.bold(
            `✖ ${count} problems (${results.errorCount} errors, ${warningCount} warnings${todoSummary})`
          )
        )
      );

      if (
        results.fixableErrorCount > 0 ||
        results.fixableWarningCount > 0 ||
        (this.options.includeTodo && results.fixableTodoCount > 0)
      ) {
        let fixableSummary = '  ';

        if (this.options.includeTodo && results.fixableTodoCount > 0) {
          fixableSummary += `${results.fixableErrorCount} errors, ${results.fixableWarningCount} warnings, and ${results.fixableTodoCount} todos`;
        } else {
          fixableSummary += `${results.fixableErrorCount} errors and ${results.fixableWarningCount} warnings`;
        }

        fixableSummary += ' potentially fixable with the `--fix` option.';

        this.console.log(chalk.red(chalk.bold(fixableSummary)));
      }
    }

    if (this.options.updateTodo && todoInfo) {
      let todoSummary = `✔ ${todoInfo.added} todos created`;

      if (Number.isInteger(todoInfo.removed)) {
        todoSummary += `, ${todoInfo.removed} todos removed`;
      }

      if (todoInfo.todoConfig && todoInfo.todoConfig.daysToDecay) {
        let daysToDecay = todoInfo.todoConfig.daysToDecay;
        let todoConfigSummary = [];

        if (daysToDecay.warn) {
          todoConfigSummary.push(`warn after ${daysToDecay.warn}`);
        }

        if (daysToDecay.error) {
          todoConfigSummary.push(`error after ${daysToDecay.error}`);
        }

        if (todoConfigSummary.length) {
          todoSummary += ` (${todoConfigSummary.join(', ')} days)`;
        }
      }

      this.console.log(todoSummary);
    }
  }

  static errorsToMessages(filePath, errors, options = {}) {
    errors = errors || [];

    if (!options.includeTodo) {
      errors = errors.filter((error) => error.severity !== Linter.TODO_SEVERITY);
    }

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
    } else if (error.severity === Linter.TODO_SEVERITY) {
      message += `  ${chalk.blueBright('todo')}`;
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

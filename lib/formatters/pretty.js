import chalk from 'chalk';

import { WARNING_SEVERITY, TODO_SEVERITY } from '../helpers/severity.js';

export default class PrettyFormatter {
  constructor(options = {}) {
    this.options = options;
  }

  format(results, todoInfo) {
    let output = [];

    if (this.options.hasResultData) {
      for (const filePath of Object.keys(results.files)) {
        let fileResults = results.files[filePath];
        let messages = this.options.quiet
          ? fileResults.messages.filter((r) => r.severity > WARNING_SEVERITY)
          : fileResults.messages;

        let formattedOutput = PrettyFormatter.errorsToMessages(filePath, messages, this.options);
        if (formattedOutput !== '') {
          output.push(formattedOutput);
        }
      }

      let warningCount = this.options.quiet ? 0 : results.warningCount;
      let shouldNotPrintTodos = !this.options.includeTodo;
      let todoCount = this.options.quiet || shouldNotPrintTodos ? 0 : results.todoCount;
      let count = results.errorCount + warningCount + todoCount;

      if (count > 0) {
        let todoSummary = this.options.includeTodo ? `, ${todoCount} todos` : '';

        output.push(
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

          output.push(chalk.red(chalk.bold(fixableSummary)));
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

        output.push(todoSummary);
      }
    }

    return output.join('\n');
  }

  static errorsToMessages(filePath, errors, options = {}) {
    errors = errors || [];

    if (!options.includeTodo) {
      errors = errors.filter((error) => error.severity !== TODO_SEVERITY);
    }

    if (errors.length === 0) {
      return '';
    }

    let errorsMessages = errors
      .map((error) => PrettyFormatter._formatError(error, options))
      .join('\n');

    return `${chalk.underline(filePath)}\n${errorsMessages}\n`;
  }

  static _formatError(error, options = {}) {
    let message = '';

    let line = error.line === undefined ? '-' : error.line;
    let column = error.column === undefined ? '-' : error.column;

    message += chalk.dim(`  ${line}:${column}`);

    if (error.severity === WARNING_SEVERITY) {
      message += `  ${chalk.yellow('warning')}`;
    } else if (error.severity === TODO_SEVERITY) {
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

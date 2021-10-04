const {
  buildTodoDatum,
  getTodoBatches,
  todoStorageDirExists,
  writeTodos,
  readTodosForFilePath,
  applyTodoChanges,
  getTodoStorageDirPath,
  getSeverity,
} = require('@ember-template-lint/todo-utils');

const { ERROR_SEVERITY } = require('../get-config');

module.exports = class TodoHandler {
  constructor(workingDir) {
    this._workingDir = workingDir;
  }

  update(results, writeTodoOptions) {
    let maybeTodos = this._buildMaybeTodos(results, writeTodoOptions.todoConfig);
    let todoBatchCounts = writeTodos(this._workingDir, maybeTodos, writeTodoOptions);

    return todoBatchCounts;
  }

  processResults(results, shouldCleanTodos, writeTodoOptions) {
    if (!todoStorageDirExists(this._workingDir)) {
      return results;
    }

    let existingTodoFiles = readTodosForFilePath(this._workingDir, writeTodoOptions.filePath);

    let { remove, stable, expired } = getTodoBatches(
      this._buildMaybeTodos(results, writeTodoOptions.todoConfig),
      existingTodoFiles,
      writeTodoOptions
    );

    if (remove.size > 0 || expired.size > 0) {
      if (shouldCleanTodos) {
        applyTodoChanges(
          getTodoStorageDirPath(this._workingDir),
          new Map(),
          new Map([...remove, ...expired])
        );
      } else {
        for (const [, todo] of remove) {
          results.push({
            rule: 'invalid-todo-violation-rule',
            message: `Todo violation passes \`${todo.ruleId}\` rule. Please run \`ember-template-lint ${todo.filePath} --clean-todo\` to remove this todo from the todo list.`,
            filePath: todo.filePath,
            moduleId: todo.moduleId,
            severity: 2,
            isFixable: true,
          });
        }
      }
    }

    for (const todo of [...stable.values()]) {
      let severity = getSeverity(todo);

      if (severity === ERROR_SEVERITY) {
        continue;
      }

      let result = results.find((result) => result === todo.originalLintResult);

      if (result) {
        result.severity = severity;
      }
    }

    return results;
  }

  _buildMaybeTodos(results, todoConfig) {
    let builtResults = new Set();

    // we only want to pass errors into the todo generator, as todos only operate on errors
    results = results.filter((result) => result.severity === ERROR_SEVERITY);

    for (const result of results) {
      builtResults.add(
        buildTodoDatum(
          this._workingDir,
          {
            engine: 'ember-template-lint',
            filePath: result.filePath,
            ruleId: result.rule,
            range: {
              start: {
                line: result.line,
                column: result.column,
              },
              // To be updated with correct endLine/endColumn once added
              end: {
                line: result.line,
                column: result.column,
              },
            },
            source: result.source || '',
            originalLintResult: result,
          },
          todoConfig
        )
      );
    }

    return builtResults;
  }
};

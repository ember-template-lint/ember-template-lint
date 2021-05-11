const {
  buildTodoData,
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
    this._processedResults = [];
  }

  async update(results, writeTodoOptions) {
    this._processedResults = this._buildResult(results);

    let todoBatchCounts = await writeTodos(
      this._workingDir,
      this._processedResults,
      writeTodoOptions
    );

    return todoBatchCounts;
  }

  async processResults(results, shouldCleanTodos, writeTodoOptions) {
    if (!todoStorageDirExists(this._workingDir)) {
      return results;
    }

    let existingTodoFiles = await readTodosForFilePath(this._workingDir, writeTodoOptions.filePath);

    let [, remove, stable, expired] = await getTodoBatches(
      buildTodoData(this._workingDir, this._buildResult(results)),
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

      let result = results.find(
        (result) =>
          result.filePath === todo.filePath &&
          result.rule === todo.ruleId &&
          result.line === todo.line &&
          result.column === todo.column
      );

      if (result) {
        result.severity = severity;
      }
    }

    return results;
  }

  _buildResult(results) {
    let builtResults = new Map();

    for (const result of results) {
      let resultForFile = builtResults.get(result.filePath);

      if (resultForFile === undefined) {
        resultForFile = {
          filePath: result.filePath,
          messages: [],
          errorCount: 0,
          source: result.source,
        };

        builtResults.set(result.filePath, resultForFile);
      }

      resultForFile.messages.push({ ...result });
      resultForFile.errorCount += 1;
    }
    return [...builtResults.values()];
  }
};

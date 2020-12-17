const {
  buildTodoData,
  getTodoBatches,
  todoStorageDirExists,
  writeTodos,
  readTodosForFilePath,
  applyTodoChanges,
  getTodoStorageDirPath,
} = require('@ember-template-lint/todo-utils');

const { TODO_SEVERITY } = require('../get-config');

module.exports = class TodoHandler {
  constructor(workingDir) {
    this._workingDir = workingDir;
    this._processedResults = [];
  }

  async update(filePath, results) {
    this._processedResults = this._buildResult(results);

    await writeTodos(this._workingDir, this._processedResults, filePath);
  }

  async processResults(filePath, results, shouldFix) {
    if (!todoStorageDirExists(this._workingDir)) {
      return results;
    }

    let existingTodoFiles = await readTodosForFilePath(this._workingDir, filePath);

    let [, itemsToRemoveFromTodos, existingTodos] = await getTodoBatches(
      buildTodoData(this._workingDir, this._buildResult(results)),
      existingTodoFiles
    );

    if (itemsToRemoveFromTodos.size > 0) {
      if (shouldFix) {
        applyTodoChanges(getTodoStorageDirPath(this._workingDir), [], itemsToRemoveFromTodos);
      } else {
        itemsToRemoveFromTodos.forEach((todo) => {
          results.push({
            rule: 'invalid-todo-violation-rule',
            message: `Todo violation passes \`${todo.ruleId}\` rule. Please run \`--update-todo\` to remove this todo from the todo list.`,
            filePath: todo.filePath,
            moduleId: todo.moduleId,
            severity: 2,
            isFixable: true,
          });
        });
      }
    }

    [...existingTodos.values()].forEach((todo) => {
      let result = results.find(
        (result) =>
          result.filePath === todo.filePath &&
          result.rule === todo.ruleId &&
          result.line === todo.line &&
          result.column === todo.column
      );

      result.severity = TODO_SEVERITY;
    });

    return results;
  }

  _buildResult(results) {
    let builtResults = [];

    for (const result of results) {
      let resultForFile = builtResults.find((r) => r.filePath === result.filePath);

      if (resultForFile) {
        resultForFile.messages.push({ ...result });
        resultForFile.errorCount += 1;
      } else {
        builtResults.push({
          filePath: result.filePath,
          messages: [{ ...result }],
          errorCount: 1,
          source: result.source,
        });
      }
    }

    return builtResults;
  }
};
